import { ArcademuGenerator } from './generator';

const proto = ArcademuGenerator.prototype;

proto['wifi_isconnected'] = function () {
  return ['runtime.wifiConnected', this.ORDER_MEMBER];
};
