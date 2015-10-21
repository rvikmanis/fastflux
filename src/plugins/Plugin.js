const assign = require('object-assign');

module.exports = class Plugin {

  constructor({options, ...rest}) {
    this.options = assign({}, options);
    Object.getOwnPropertyNames(rest).forEach(name => {
      this[name] = rest[name];
    });

    this.configure = function(options={}) {
      options = assign({}, this.options, options);
      return new this.constructor({options, ...rest});
    }
  }

};
