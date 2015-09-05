var path = require("path");
var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");

module.exports = function serve(logName, rootPath) {
  return function(callback) {
    var webpackConfig = {
      context: path.join(__dirname, "..", rootPath),
      entry: './index.js',
      output: {
        path: path.join(__dirname, "..", rootPath),
        publicPath: path.join("/", rootPath),
        filename: "bundle.js"
      },
      module: {
        loaders: [
          {
            test: /\.(jsx?|es6)$/,
            exclude: /node_modules/,
            loader: "babel?stage=0&loose=all"
          },
          {
            test: /\.scss$/,
            loader: "style!css!sass?sourceMap"
          }
        ]
      },
      resolveLoader: {
        root: path.join(__dirname, "..", "node_modules")
      },
      debug: true
    };

    new WebpackDevServer(webpack(webpackConfig), {
        publicPath: webpackConfig.output.publicPath,
        stats: {colors: true}
      })
      .listen(8080, "localhost", function(err) {
    		if(err) throw new gutil.PluginError(logName, err);
    		gutil.log("["+logName+"]", "http://localhost:8080" + webpackConfig.output.publicPath);
    	});

  }
};
