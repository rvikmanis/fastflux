module.exports = {
  createDispatcher: require('./core/dispatcher').createDispatcher,
  createStore: require('./core/store').createStore,
  createSubscriber: require('./core/subscriber').createSubscriber,
  utils: require('./utils')
};
