const {Application, Store} = require('../../src/index.js');
const stores = {test: class extends Store {}};

describe('Application.prototype.addStore', () => {
  it('returns the store id', () => {
    const app = new Application;
    const id = app.addStore('test', stores.test);
    expect(id).toEqual('test');
  });

  it('saves the store in this._stores[id]', () => {
    const a = new Application;
    a.addStore('test', stores.test);
    expect(a._stores['test'] instanceof Store).toBeTruthy()
  });

  it('throws when trying to add store with existing id', () => {
    const a = new Application;
    a.addStore('test', stores.test);
    expect(() => a.addStore('test', stores.test)).toThrow()
  });

  it('throws when trying to add something that is not a store', () => {
    const a = new Application;
    expect(() => a.addStore('test', 1000)).toThrow();
    expect(() => a.addStore('test', 'foo')).toThrow();
    expect(() => a.addStore('test', {})).toThrow();
    expect(() => a.addStore('test', [])).toThrow();
  });

  it('adds store\'s bound onMessage callback to the dispatcher', () => {
    const a = new Application;
    a.addStore('test', stores.test);
    expect(a._stores['test'].onMessage)
     .toEqual(a._dispatcher._callbacks['test'].originalFunction);
  });
});
