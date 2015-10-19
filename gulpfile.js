var assign = require("object-assign");
var gulp = require('gulp');
var gutil = require("gulp-util");
var webpack = require("webpack");
var babel = require('gulp-babel');
var del = require("del");
var webpackConfig = require("./webpack.config");
var serve = require("./tools/serve");

gulp.task('clean', function () {
  del(['dist', 'browser', 'lib', 'plugins', 'vendor', 'index.js']);
});

gulp.task('full-clean', ['clean'], function() {
    del(['node_modules']);
});

gulp.task('build', function () {
    return gulp.src(["src/**/*.{jsx,js,es6}"])
        .pipe(babel({stage: 0, loose: "all", blacklist: ["es6.modules"]}))
        .pipe(gulp.dest("."))
});

gulp.task("webpack:build", ["build"], function (callback) {
    webpack(webpackConfig, function (err, stats) {
      if (err) throw new gutil.PluginError("webpack:build", err);
      gutil.log("[webpack:build]", stats.toString({
        colors: true
      }));
      callback();
    });
});

gulp.task('default', ['clean', 'webpack:build']);

gulp.task("watch", ["webpack:build"], function () {
    gulp.watch(["src/**/*"], ["webpack:build"]);
});

gulp.task(
    "example:todos",
    ["webpack:build"],
    serve("example:todos", "./examples/todos/")
);
