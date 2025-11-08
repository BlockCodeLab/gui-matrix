export default () => ({
  id: 'operator',
  skipXML: true,
  blocks: [
    {
      id: 'add',
      mpy(block) {
        const num1Code = this.valueToCode(block, 'NUM1', this.ORDER_NONE) || 0;
        const num2Code = this.valueToCode(block, 'NUM2', this.ORDER_NONE) || 0;
        const code = `(num(${num1Code}) + num(${num2Code}))`;
        return [code, this.ORDER_SUBTRACTION];
      },
    },
    {
      id: 'subtract',
      mpy(block) {
        const num1Code = this.valueToCode(block, 'NUM1', this.ORDER_NONE) || 0;
        const num2Code = this.valueToCode(block, 'NUM2', this.ORDER_NONE) || 0;
        const code = `(num(${num1Code}) - num(${num2Code}))`;
        return [code, this.ORDER_SUBTRACTION];
      },
    },
    {
      id: 'multiply',
      mpy(block) {
        const num1Code = this.valueToCode(block, 'NUM1', this.ORDER_NONE) || 0;
        const num2Code = this.valueToCode(block, 'NUM2', this.ORDER_NONE) || 0;
        const code = `(num(${num1Code}) * num(${num2Code}))`;
        return [code, this.ORDER_SUBTRACTION];
      },
    },
    {
      id: 'divide',
      mpy(block) {
        const num1Code = this.valueToCode(block, 'NUM1', this.ORDER_NONE) || 0;
        const num2Code = this.valueToCode(block, 'NUM2', this.ORDER_NONE) || 0;
        const code = `(num(${num1Code}) / num(${num2Code}))`;
        return [code, this.ORDER_SUBTRACTION];
      },
    },
    {
      id: 'random',
      mpy(block) {
        const minCode = this.valueToCode(block, 'FROM', this.ORDER_NONE) || 0;
        const maxCode = this.valueToCode(block, 'TO', this.ORDER_NONE) || 0;
        const code = `runtime.random(num(${minCode}), num(${maxCode}))`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      // >
      id: 'gt',
      mpy(block) {
        const operand1Code = this.valueToCode(block, 'OPERAND1', this.ORDER_NONE) || 0;
        const operand2Code = this.valueToCode(block, 'OPERAND2', this.ORDER_NONE) || 0;
        const code = `(num(${operand1Code}) > num(${operand2Code}))`;
        return [code, this.ORDER_RELATIONAL];
      },
    },
    {
      // >=
      id: 'gte',
      mpy(block) {
        const operand1Code = this.valueToCode(block, 'OPERAND1', this.ORDER_NONE) || 0;
        const operand2Code = this.valueToCode(block, 'OPERAND2', this.ORDER_NONE) || 0;
        const code = `(num(${operand1Code}) >= num(${operand2Code}))`;
        return [code, this.ORDER_RELATIONAL];
      },
    },
    {
      // <
      id: 'lt',
      mpy(block) {
        const operand1Code = this.valueToCode(block, 'OPERAND1', this.ORDER_NONE) || 0;
        const operand2Code = this.valueToCode(block, 'OPERAND2', this.ORDER_NONE) || 0;
        const code = `(num(${operand1Code}) < num(${operand2Code}))`;
        return [code, this.ORDER_RELATIONAL];
      },
    },
    {
      // <=
      id: 'lte',
      mpy(block) {
        const operand1Code = this.valueToCode(block, 'OPERAND1', this.ORDER_NONE) || 0;
        const operand2Code = this.valueToCode(block, 'OPERAND2', this.ORDER_NONE) || 0;
        const code = `(num(${operand1Code}) <= num(${operand2Code}))`;
        return [code, this.ORDER_RELATIONAL];
      },
    },
    {
      id: 'equals',
      mpy(block) {
        const operand1Code = this.valueToCode(block, 'OPERAND1', this.ORDER_NONE) || 0;
        const operand2Code = this.valueToCode(block, 'OPERAND2', this.ORDER_NONE) || 0;
        const code = `runtime.equals(${operand1Code}, ${operand2Code})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      id: 'notequals',
      mpy(block) {
        const operand1Code = this.valueToCode(block, 'OPERAND1', this.ORDER_NONE) || 0;
        const operand2Code = this.valueToCode(block, 'OPERAND2', this.ORDER_NONE) || 0;
        const code = `(not runtime.equals(${operand1Code} = ${operand2Code}))`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      id: 'and',
      mpy(block) {
        const operand1Code = this.valueToCode(block, 'OPERAND1', this.ORDER_NONE) || 'False';
        const operand2Code = this.valueToCode(block, 'OPERAND2', this.ORDER_NONE) || 'False';
        const code = `(${operand1Code} and ${operand2Code})`;
        return [code, this.ORDER_LOGICAL_AND];
      },
    },
    {
      id: 'or',
      mpy(block) {
        const operand1Code = this.valueToCode(block, 'OPERAND1', this.ORDER_NONE) || 'False';
        const operand2Code = this.valueToCode(block, 'OPERAND2', this.ORDER_NONE) || 'False';
        const code = `(${operand1Code} or ${operand2Code})`;
        return [code, this.ORDER_LOGICAL_OR];
      },
    },
    {
      id: 'not',
      mpy(block) {
        const operandValue = this.valueToCode(block, 'OPERAND', this.ORDER_NONE) || 'False';
        const code = `(not ${operandValue})`;
        return [code, this.ORDER_LOGICAL_NOT];
      },
    },
    {
      id: 'join',
      mpy(block) {
        const string1Code = this.valueToCode(block, 'STRING1', this.ORDER_NONE) || '""';
        const string2Code = this.valueToCode(block, 'STRING2', this.ORDER_NONE) || '""';
        const code = `(str(${string1Code}) + str(${string2Code}))`;
        return [code, this.ORDER_ATOMIC];
      },
    },
    {
      id: 'letter_of',
      mpy(block) {
        const letterValue = this.getAdjusted(block, 'LETTER');
        const stringValue = this.valueToCode(block, 'STRING', this.ORDER_NONE) || '""';
        const code = `runtime.list(str(${stringValue}), "get", ${letterValue})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      id: 'length',
      mpy(block) {
        const stringValue = this.valueToCode(block, 'STRING', this.ORDER_NONE) || '""';
        const code = `len(str(${stringValue}))`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      id: 'contains',
      mpy(block) {
        const string1Code = this.valueToCode(block, 'STRING1', this.ORDER_NONE) || '""';
        const string2Code = this.valueToCode(block, 'STRING2', this.ORDER_NONE) || '""';
        const code = `(str(${string1Code}).count(str(${string2Code})) > 0)`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      id: 'mod',
      mpy(block) {
        const num1Code = this.valueToCode(block, 'NUM1', this.ORDER_NONE) || 0;
        const num2Code = this.valueToCode(block, 'NUM2', this.ORDER_NONE) || 0;
        const code = `(num(${num1Code}) % num(${num2Code}))`;
        return [code, this.ORDER_MODULUS];
      },
    },
    {
      id: 'round',
      mpy(block) {
        this.definitions_['import_math'] = 'import math';
        const numCode = this.valueToCode(block, 'NUM', this.ORDER_NONE) || 0;
        const code = `math.round(num(${numCode}))`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      id: 'mathop',
      mpy(block) {
        this.definitions_['import_math'] = 'import math';
        const numCode = this.valueToCode(block, 'NUM', this.ORDER_NONE) || 0;
        const operatorValue = block.getFieldValue('OPERATOR');
        let code = '';
        if (operatorValue === 'ceiling') {
          code += `math.ceil(num(${numCode}))`;
        } else if (operatorValue === 'sin' || operatorValue === 'cos' || operatorValue === 'tan') {
          code += `math.${operatorValue}(math.radians(num(${numCode})))`;
        } else if (operatorValue === 'asin' || operatorValue === 'acos' || operatorValue === 'atan') {
          code += `math.degrees(math.${operatorValue}(num(${numCode})))`;
        } else if (operatorValue === 'ln') {
          code += `(math.log(num(${numCode}))`;
        } else if (operatorValue === 'log') {
          code += `(math.log10(num(${numCode}))`;
        } else if (operatorValue === 'e ^') {
          code += `math.exp(num(${numCode}))`;
        } else if (operatorValue === '10 ^') {
          code += `math.pow(10, num(${numCode}))`;
        } else if (operatorValue === 'abs') {
          code += `abs(num(${numCode}))`;
        } else {
          code += `math.${operatorValue}(num(${numCode}))`;
        }
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
  ],
});
