var assign = require("object-assign");
var gulp = require('gulp');
var gutil = require("gulp-util");
var babel = require('gulp-babel');
var istanbul = require('gulp-istanbul');
var jasmine = require('gulp-jasmine');
var webpack = require("webpack");
var del = require("del");
var exec = require('child_process').exec;
var pkg = require('./package');

var config = {
  babel: require('./config/babel'),
  webpack: require("./config/webpack")
};

gulp.task('clean:webpack', function(callback) {
  del(['dist'], function() {
    callback()
  });
});

gulp.task('clean:node', function (callback) {
  del(['core', 'utils', 'index.js'], function() {
    callback()
  })
});

gulp.task('clean:test', function(callback) {
    del(['coverage'], function() {
      callback()
    })
});

gulp.task('clean:docs', function(callback) {
    del(['docs'], function() {
      callback()
    })
});

gulp.task('clean', ['clean:node', 'clean:webpack', 'clean:test', 'clean:docs']);

gulp.task('build:node', ['clean:node'], function () {
    return gulp.src(["src/**/*.js", "!src/browser/**/*"])
        .pipe(babel(config.babel))
        .pipe(gulp.dest("."))
});

gulp.task("build:webpack", ["clean:webpack"], function (callback) {
    webpack(config.webpack, function (err, stats) {
      if (err) throw new gutil.PluginError("build:webpack", err);
      console.log(stats.toString({colors: true}));
      callback()
    });
});

gulp.task("build:docs", ["clean:docs"], function(callback) {
    exec("./node_modules/.bin/esdoc"+
         " -c esdoc.json",
      function(err) {
        callback(err);
      });
});

gulp.task('build', ['build:node', 'build:webpack', 'build:docs']);

gulp.task("watch", ["build"], function () {
    gulp.watch(["src/**/*"], ["build"]);
});

gulp.task('test:pre', ['build:node', 'clean:test'], function () {
  return gulp.src(['core/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['test:pre'], function () {
  return gulp.src('spec/**/*')
   .pipe(jasmine({reporter: new (require('jasmine-spec-reporter'))}))
   .pipe(istanbul.writeReports())
   .pipe(istanbul.enforceThresholds({ thresholds: { global: 80 } }));
});
