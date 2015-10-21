var assign = require("object-assign");
var gulp = require('gulp');
var gutil = require("gulp-util");
var webpack = require("webpack");
var babel = require('gulp-babel');
var del = require("del");

var config = {
  node: require('./config/node'),
  webpack: require("./config/webpack")
};

gulp.task('clean:build', function (callback) {
  del(['dist', 'lib', 'plugins', 'vendor', 'index.js'], function() {
    callback()
  })
});

gulp.task('clean:all', ['clean:build'], function(callback) {
    del(['node_modules'], function() {
      callback()
    })
});

gulp.task('build:node', ['clean:build'], function () {
    return gulp.src(["src/**/*.{jsx,js,es6}", "!src/browser/**/*"])
        .pipe(babel(config.node.babel))
        .pipe(gulp.dest("."))
});

gulp.task("build:webpack", ["clean:build"], function (callback) {
    webpack(config.webpack.dist, function (err, stats) {
      if (err) throw new gutil.PluginError("build:webpack", err);
      gutil.log("[build:webpack]", stats.toString({
        colors: true
      }));
      callback()
    });
});

gulp.task('build:all', ['build:node', 'build:webpack']);

gulp.task("watch", ["build:all"], function () {
    gulp.watch(["src/**/*"], ["build:all"]);
});
