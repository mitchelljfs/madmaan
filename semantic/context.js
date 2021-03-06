/*
 * Semantic Analysis Context
 *
 * const Context = require('./semantics/context');
 *
 * A context object holds state for the semantic analysis phase, such as the
 * enclosing function (if any), whether or not we are in a loop, a map of
 * variables defined in this scope, and the parent context.
 */

const FuncDec = require('../entities/funcdec');
const Params = require('../entities/params');
const error = require('../error');
//const VariableDefinition = require('./entities/variabledefinition');
//const FunctionDefinition = require('./entities/functiondefinition');
const Type = require('../entities/type');
//const Arg = require('./entities/arg');

class Context {
  constructor({ parent = null, currentFunction = null, inLoop = false } = {}) {
    this.parent = parent;
    this.variables = Object.create(null);
    this.currentFunction = currentFunction;
    this.inLoop = inLoop;
  }

  createChildContextForFunctionBody(currentFunction) {
    // When entering a new function, we're not in a loop anymore
    return new Context({ parent: this, currentFunction, inLoop: false });
  }

  createChildContextForLoop() {
    // When entering a loop body, just set the inLoop field, retain others
    return new Context({ parent: this, currentFunction: this.currentFunction, inLoop: true });
  }

  createChildContextForBlock() {
    // Retain function and loop setting
    return new Context({
      parent: this,
      currentFunction: this.currentFunction,
      inLoop: this.inLoop,
    });
  }

  addVariable(entity, type) {
    // console.log(entity);
    if (entity in this.variables) {
      throw new Error(`Identitier ${entity} already declared in this scope`);
    }
    this.variables[entity] = type;
  }

  lookup(id) {
    // console.log(id);
    // console.log("is " + id + " stored? " + (id in this.variables));
    if (id in this.variables) {
      return this.variables[id];
    } else if (this.parent === null) {
      throw new Error(`Identifier ${id} has not been declared`);
    } else {
      return this.parent.lookup(id);
    }
  }

  assertInFunction(message) {
    if (!this.currentFunction) {
      throw new Error(message);
    }
  }

  assertIsFunction(entity) { // eslint-disable-line class-methods-use-this
    if (entity.constructor !== FuncDec) {
      throw new Error(`${entity.id} is not a function`);
    }
  }
}

Context.INITIAL = new Context();
/*new FuncDec('print', [new Params('_', '')], null).analyze(Context.INITIAL);
new FuncDec('sqrt', [new Params('_', '')], null).analyze(Context.INITIAL);*/

module.exports = Context;
