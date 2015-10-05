var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: "./index.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "fastflux.min.js",
    library: "Fastflux",
    libraryTarget: "var"
  },
  externals: [{
    react: "React"
  }],
  plugins: [new webpack.optimize.UglifyJsPlugin()]
};