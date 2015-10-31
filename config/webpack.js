var webpack = require("webpack");
var path = require("path");

var dist = {
  entry: {
    "fastflux": "./fastflux"
    //"plugins/socketio-broker": "./plugins/socketio-broker",
    //"plugins/message-history": "./plugins/message-history"
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
        test: /\.js$/,
        include: path.join(__dirname, "..", "src"),
        exclude: /node_modules/,
        loader: "babel",
        query: {
          loose: "all",
          whitelist: [
            "es6.destructuring",
            "es6.arrowFunctions",
            "es6.parameters",
            "es6.blockScoping"
          ]
        }
      }
    ]
  },
  resolve: {
    extensions: ["", ".js"]
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
