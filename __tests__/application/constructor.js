describe('Application.prototype.constructor', () => {
  const {Application, Store} = require('../../src/index.js');

  const stores = {test: class extends Store {}};
  const plugins = [{setUp(app) {app.testPlugin = true}}];

  it('can be constructed like: new Application', () => {
    const app = new Application;
    expect(app instanceof Application).toEqual(true);
  });

  it('can be constructed like: new Application(stores)', () => {
    const app = new Application(stores);
    expect(app.hasStore('test')).toEqual(true);
  });

  it('can be constructed like: new Application(plugins)', () => {
    const app = new Application(plugins);
    expect(app.testPlugin).toEqual(true);
  });

  it('can be constructed like: new Application(plugins, stores)', () => {
    const app = new Application(plugins, stores);
    expect(app.testPlugin).toEqual(true);
    expect(app.hasStore('test')).toEqual(true);
  });

  it('can be constructed like: new Application(stores, plugins)', () => {
    const app = new Application(stores, plugins);
    expect(app.testPlugin).toEqual(true);
    expect(app.hasStore('test')).toEqual(true);
  });

  it('throws when called with more than 2 args', () => {
    expect(() => new Application(stores, plugins, {})).toThrow();
  });

});
