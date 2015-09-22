var assign = require("object-assign");
var gulp = require('gulp');
var gutil = require("gulp-util");
var webpack = require("webpack");
var babel = require('gulp-babel');
var del = require("del");
var webpackConfig = require("./webpack.config");
var serve = require("./tools/serve");

gulp.task('clean', function () {
    del(['dist-web', 'dist-node']);
});

gulp.task('full-clean', ['clean'], function() {
    del(['node_modules']);
});

gulp.task('build-node', function () {
    return gulp.src(["src/**/*.{jsx,js,es6}"])
        .pipe(babel({stage: 0, loose: "all", blacklist: ["es6.modules"]}))
        .pipe(gulp.dest("dist-node"))
});

gulp.task("webpack:build", ["build-node"], function (callback) {
    webpack(webpackConfig, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack:build", err);
        callback();
    });
});

gulp.task('default', ['webpack:build']);

gulp.task("webpack:build-dev", ["build-node"], function (callback) {
    var devConfig = assign({}, webpackConfig);
    devConfig["plugins"] = [];
    devConfig["output"]["filename"] = "fastflux.js";

    webpack(devConfig, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack:build-dev", err);
        gutil.log("[webpack:build-dev]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task("watch", ["webpack:build-dev"], function () {
    gulp.watch(["src/**/*"], ["webpack:build-dev"]);
});

gulp.task(
    "example:todos",
    ["webpack:build"],
    serve("example:todos", "./examples/todos/")
);