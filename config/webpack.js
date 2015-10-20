var webpack = require("webpack");
var path = require("path");
var assign = require("object-assign");

var minified = {
  entry: {
    "fastflux": "./browser/fastflux",
    "plugins/fastflux-socketio-broker": "./browser/plugins/fastflux-socketio-broker",
    "plugins/fastflux-message-history": "./browser/plugins/fastflux-message-history"
  },
  output: {
    path: path.join(__dirname, "..", "dist"),
    filename: "[name].min.js"
  },
  externals: [{
    react: "React"
  }],
  plugins: [new webpack.optimize.UglifyJsPlugin()]
};

var normal = assign({}, minified, {
  output: assign({}, minified.output, {filename: "[name].js"}),
  plugins: []
});

module.exports = {
  minified: minified,
  normal: normal
};
