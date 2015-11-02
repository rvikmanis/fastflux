var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: {
    "fastflux": "./fastflux"
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
        query: require('./babel')
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
