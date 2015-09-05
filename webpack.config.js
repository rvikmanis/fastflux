var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: "./dist-node/index.js",
  output: {
    path: path.join(__dirname, "dist-web"),
    filename: "fastflux.min.js",
    library: "Fastflux",
    libraryTarget: "var"
  },
  externals: [{
    react: "React"
  }],
  plugins: [new webpack.optimize.UglifyJsPlugin()]
};