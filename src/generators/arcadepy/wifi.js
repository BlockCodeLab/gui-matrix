import { ArcadepyGenerator } from './generator';

const proto = ArcadepyGenerator.prototype;

proto['wifi_whenconnected'] = function () {
  const branchCode = this.eventToCode('wifi_connected', 'runtime.flash_mode', 'target');
  return `@when_wificonnected\n${branchCode}`;
};

proto['wifi_connectto'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const ssidCode = this.valueToCode(block, 'SSID', this.ORDER_NONE) || '""';
  const passwordCode = this.valueToCode(block, 'PASSWORD', this.ORDER_NONE) || '""';
  code += `runtime.connect_wifi(str(${ssidCode}), str(${passwordCode}))\n`;
  return code;
};

proto['wifi_disconnect'] = function () {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  code += 'runtime.disconnect_wifi()\n';
  return code;
};

proto['wifi_isconnected'] = function () {
  return ['runtime.wifi_connected', this.ORDER_MEMBER];
};
