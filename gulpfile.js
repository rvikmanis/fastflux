var assign = require("object-assign");
var gulp = require('gulp');
var gutil = require("gulp-util");
var webpack = require("webpack");
var babel = require('gulp-babel');
var del = require("del");

var config = {
  babel: {stage: 0, loose: "all", blacklist: ["es6.modules"]},
  webpack: require("./config/webpack")
};
var webpackConfig = require("./webpack.config");
var serve = require("./tools/serve");

gulp.task('clean', function (callback) {
  del(['dist', 'browser', 'lib', 'plugins', 'vendor', 'index.js'], function() {
    callback()
  })
});

gulp.task('full-clean', ['clean'], function(callback) {
    del(['node_modules'], function() {
      callback()
    })
});

gulp.task('build', ['clean'], function () {
    return gulp.src(["src/**/*.{jsx,js,es6}"])
        .pipe(babel({stage: 0, loose: "all", blacklist: ["es6.modules"]}))
        .pipe(gulp.dest("."))
});

gulp.task("webpack:build", ["build"], function (callback) {
    webpack(config.webpack.normal, function (err, stats) {
      if (err) throw new gutil.PluginError("webpack:build", err);
      gutil.log("[webpack:build]", stats.toString({
        colors: true
      }));
      callback()
    });
});

gulp.task("webpack:build-minified", ["build"], function (callback) {
    webpack(config.webpack.minified, function (err, stats) {
      if (err) throw new gutil.PluginError("webpack:build-minified", err);
      gutil.log("[webpack:build-minified]", stats.toString({
        colors: true
      }));
      callback()
    });
});

gulp.task('default', ['webpack:build', 'webpack:build-minified']);

gulp.task("watch", ["webpack:build", 'webpack:build-minified'], function () {
    gulp.watch(["src/**/*"], ["webpack:build", "webpack:build-minified"]);
});

gulp.task(
    "example:todos",
    ["webpack:build", "webpack:build-minified"],
    serve("example:todos", "./examples/todos/")
);
