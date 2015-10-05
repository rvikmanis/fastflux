const React = require("react");
const assign = require("object-assign");
const bind = require("../utils").bind;

module.exports = {

  subscribe(...storeIds) {
    const app = this;
    return ComposedComponent => class extends React.Component {
      state = {};
      onStoreChange = bind(this._onStoreChange, this);

      componentDidMount() {
        let update = {};

        storeIds.forEach(id => {
          const store = app.getStore(id);
          update[id] = store.getState();
          store.listen(this.onStoreChange);
        });

        this.setState(update);
      }

      componentWillUnmount() {
        storeIds
          .map(bind(app.getStore, app))
          .forEach(store => store.unlisten(this.onStoreChange));
      }

      _onStoreChange() {
        let update = {};
        storeIds.forEach(id => update[id] = app.getStore(id).getState());
        this.setState(update);
      }

      render() {
        const props = assign({}, this.props, this.state);
        return (<ComposedComponent {...props} />)
      }
    }
  }

};
