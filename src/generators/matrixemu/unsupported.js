import { MatrixemuGenerator } from './generator';

const proto = MatrixemuGenerator.prototype;

// 不支持积木列表
//

proto['unsupported_hat'] = () => '';
proto['unsupported_statement'] = () => '';
proto['unsupported_boolean'] = () => '';
proto['unsupported_string'] = () => '';
proto['unsupported_number'] = () => '';
