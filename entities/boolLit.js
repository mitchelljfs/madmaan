const Type = require('./type.js');

class BoolLit {
  constructor(theBool) {
    this.theBool = theBool;
  }

  toString() {
    return `(BoolLit : ${this.theBool.toString()})`;
  }

  analyze(context) {
    this.type = Type.BOOL;
    return this.type;
  }
}

module.exports = BoolLit;
