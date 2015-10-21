var webpack = require("webpack");
var path = require("path");
var assign = require("object-assign");

var dist = {
  entry: {
    "fastflux": "./fastflux",
    "plugins/socketio-broker": "./plugins/socketio-broker",
    "plugins/message-history": "./plugins/message-history"
  },
  context: path.join(__dirname, "..", "src/browser"),
  output: {
    path: path.join(__dirname, "..", "dist"),
    filename: "[name].min.js",
    sourceMapFilename: "[file].map"
  },
  module: {
    loaders: [
      {
        test: /\.(jsx?|es6)$/,
        include: path.join(__dirname, "..", "src"),
        exclude: /node_modules/,
        loader: "babel-loader?stage=0&loose=all&blacklist[]=es6.modules"
      }
    ]
  },
  resolve: {
    extensions: ["", ".js", ".jsx", ".es6"]
  },
  externals: [{
    react: "React"
  }],
  devtool: "source-map",
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  ]
};

module.exports = {dist: dist};
