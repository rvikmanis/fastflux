var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: {
    "fastflux": "./browser/fastflux",
    "plugins/fastflux-socketio-broker": "./browser/plugins/fastflux-socketio-broker",
    "plugins/fastflux-message-history": "./browser/plugins/fastflux-message-history"
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].min.js"
  },
  externals: [{
    react: "React"
  }],
  plugins: [new webpack.optimize.UglifyJsPlugin()]
};