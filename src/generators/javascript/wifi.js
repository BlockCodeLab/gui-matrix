import { javascriptGenerator } from './generator';

javascriptGenerator['wifi_whenconnected'] = function () {
  return `runtime.when('wifi_connected', ${this.TARGET_EVENT_CALLBACK}, target);\n`;
};

javascriptGenerator['wifi_connectto'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  code += `setTimeout(function () {\n  runtime.wifiConnected = true;\n  runtime.fire('wifi_connected');\n}, 1000)\n`;
  return code;
};

javascriptGenerator['wifi_disconnect'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  code += `runtime.wifiConnected = false;\n`;
  return code;
};

javascriptGenerator['wifi_isconnected'] = function () {
  return ['runtime.wifiConnected', this.ORDER_MEMBER];
};
