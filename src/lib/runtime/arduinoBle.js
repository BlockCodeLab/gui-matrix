
const SERVICE_UUID = "0000ffe0-0000-1000-8000-00805f9b34fb";

const BLE_AT_UUID = "0000ffe2-0000-1000-8000-00805f9b34fb";
const SERIAL_UUID = "0000ffe1-0000-1000-8000-00805f9b34fb";

const Resp_STK_INSYNC = 0x14
const Resp_STK_OK = 0x10
const Cmnd_STK_GET_SYNC = 0x30
const Cmnd_STK_SET_DEVICE = 0x42
const Cmnd_STK_ENTER_PROGMODE = 0x50
const Cmnd_STK_LOAD_ADDRESS = 0x55
const STK_UNIVERSAL = 0x56
const Cmnd_STK_PROG_PAGE = 0x64
const Cmnd_STK_LEAVE_PROGMODE =  0x51
const Cmnd_STK_READ_SIGN = 0x75
const Sync_CRC_EOP = 0x20
const  Resp_STK_NOSYNC =  0x15
const Cmnd_STK_READ_PAGE =  0x74
const OK_RESPONSE =  [Resp_STK_INSYNC, Resp_STK_OK]


const bleOptions = {
  filters:[
    { services: [SERVICE_UUID] }
  ]
}


export class ArduinoBle {

  constructor() {
    this.bleDevice = null;
    this.bleService = null;
    this.serialChar = null;
    this.atChar = null;
    this.respQueue = [];
    this._encoder = new TextEncoder();
    this._decoder = new TextDecoder();
  }
  requestPort(filters = []) {
    navigator.bluetooth.requestDevice(bleOptions)
      .then( device =>{
        this.bleDevice = device;
        device.addEventListener('gattserverdisconnected', this.handleDisconnectError);
        return device.gatt.connect();
      }).then( server => {
      this.bleServer = server
      this.bleServer.getPrimaryService(SERVICE_UUID)
        .then(service => service.getCharacteristic(SERIAL_UUID))
        .then(characteristic => characteristic.startNotifications())
        .then(characteristic => {
          this.serialChar = characteristic;
          characteristic.addEventListener('characteristicvaluechanged', this.serialNotify)
        });
      this.bleServer.getPrimaryService(SERVICE_UUID)
        .then(service => service.getCharacteristic(BLE_AT_UUID))
        .then(characteristic => characteristic.startNotifications())
        .then(characteristic => {
            this.atChar = characteristic;
            characteristic.addEventListener('characteristicvaluechanged', this.bleAtNotify);
          }
        );
    })
      .catch(e => {
        console.log(e);
      });
  }

  handleDisconnectError(event){
    console.log("disconnect " + event)
  }

  serialNotify(event){
    const dataView = event.target.value;
    console.log("serial_notify----" + dataView.byteLength + "  " + new Uint8Array(dataView.buffer));
  }

  bleAtNotify(event){

    console.log("bleAt_notify----" +this._decoder.decode(event.target.value));
  }

  waitForResponse(device, resp_data,  timeout = 5000) {
    return new Promise((resolve, reject) => {
      let timeoutId;
      const onResponse = (event) => {

        const dataView = event.target.value

        for (let i = 0; i < dataView.byteLength; i++) {
          const char = dataView.getUint8(i); // 获取单个字节
          this.respQueue.push(char);
        }
        // 验证返回值是否符合预期
        if (this.bufferEqual(resp_data, new Uint8Array(this.respQueue))) {
          console.log("rr " + this.respQueue)
          clearTimeout(timeoutId);
          device.removeEventListener('characteristicvaluechanged', onResponse);
          resolve(this.respQueue);
        }

      };

      // 设置超时处理
      timeoutId = setTimeout(() => {
        device.removeEventListener('characteristicvaluechanged', onResponse);
        reject(new Error('Timeout waiting for the expected response.'));
      }, timeout);

      // 监听 characteristic 的 value changed 事件
      console.log("监听啦")
      this.respQueue = []
      device.addEventListener('characteristicvaluechanged', onResponse);
    });
  }

  async sendATMessage(message){
    console.log("发送了 " + message)
    message = message + "\r\n";
    const data =this._encoder.encode(message);
    await this.atChar.writeValueWithResponse(data);
  }

  async sendSerialMessage(req_data){
    await this.serialChar.writeValueWithResponse(req_data);
  }

  async sendSerialAndTestRet(req_data, resp_data) {
    await this.serialChar.writeValueWithResponse(req_data);
    const resp = await this.waitForResponse(this.serialChar, resp_data);
    const ret = this.bufferEqual(resp_data, new Uint8Array(resp));
    console.log("发送--" + req_data);
    console.log("返回--" + new Uint8Array(resp));
    console.log("希望-" + resp_data);
    return ret;
  }

  async flash(){
    console.log("开始烧录啦")
    try {
      await this.sendATMessage("AT+TARGE_RESET");
      await new Promise((resolve) => setTimeout(resolve, 100))
      const syncReq =  new Uint8Array([Cmnd_STK_GET_SYNC, Sync_CRC_EOP])
      const okResp = new Uint8Array(OK_RESPONSE)
      const sync_succ = await this.sendSerialAndTestRet(syncReq, okResp);
      if(!sync_succ){
        throw new Error("stk500 sync error")
      }
      const enterProgModelReq =  new Uint8Array([Cmnd_STK_ENTER_PROGMODE, Sync_CRC_EOP])
      const enter_succ = await this.sendSerialAndTestRet(enterProgModelReq, okResp);
      if(!enter_succ){
        throw new Error("stk500 enter progmodel error")
      }
      const universalReq =  new Uint8Array([STK_UNIVERSAL, 172, 128, 0, 0, Sync_CRC_EOP])
      const universalResp = new Uint8Array([Resp_STK_INSYNC, 0, Resp_STK_OK])
      const universal_succ = await this.sendSerialAndTestRet(universalReq, universalResp);
      if(!universal_succ){
        throw new Error("stk500 universal error")
      }
      await upload(fileHex)
      const leaveProgModelReq =  new Uint8Array([Cmnd_STK_LEAVE_PROGMODE, Sync_CRC_EOP])
      const leave_succ = await this.sendSerialAndTestRet(leaveProgModelReq, okResp);
      if(!leave_succ){
        throw new Error("stk500 leaveProgMode error")
      }
    } catch (error) {
      console.log(error)
    }

    console.log("烧录成功啦");
  }

  bufferEqual(a, b) {
    if (a.length !== b.length) {
      return false
    }
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false
      }
    }
    return true
  }

}
