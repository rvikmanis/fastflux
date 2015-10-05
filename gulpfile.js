var assign = require("object-assign");
var gulp = require('gulp');
var gutil = require("gulp-util");
var webpack = require("webpack");
var babel = require('gulp-babel');
var del = require("del");
var webpackConfig = require("./webpack.config");
var serve = require("./tools/serve");

gulp.task('clean', function () {
    del([
      'dist',
      'lib',
      'plugins',
      'vendor',
      'index.js'
    ]);
});

gulp.task('full-clean', ['clean'], function() {
    del(['node_modules']);
});

gulp.task('build', function () {
    return gulp.src(["src/**/*.{jsx,js,es6}"])
        .pipe(babel({stage: 0, loose: "all", blacklist: ["es6.modules"]}))
        .pipe(gulp.dest("."))
});

gulp.task("webpack:build", ["build", "webpack:build-dev"], function (callback) {
    webpack(webpackConfig, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack:build", err);
        callback();
    });
});

gulp.task("webpack:build-dev", ["build"], function (callback) {
    var devConfig = assign({}, webpackConfig);
    devConfig["plugins"] = [];
    devConfig["output"] = assign({}, webpackConfig.output);
    devConfig["output"]["filename"] = "fastflux.js";

    webpack(devConfig, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack:build-dev", err);
        gutil.log("[webpack:build-dev]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task('default', ['webpack:build']);

gulp.task("watch", ["webpack:build"], function () {
    gulp.watch(["src/**/*"], ["webpack:build"]);
});

gulp.task(
    "example:todos",
    ["webpack:build"],
    serve("example:todos", "./examples/todos/")
);
