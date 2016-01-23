var assign = require("object-assign");
var gulp = require('gulp');
var gutil = require("gulp-util");
var babel = require('gulp-babel');
var istanbul = require('gulp-babel-istanbul');
var jasmine = require('gulp-jasmine');
var webpack = require("webpack");
var del = require("del");
var exec = require('child_process').exec;
var mergeStream = require('merge-stream');
var pkg = require('./package');

var config = {
  webpack: require("./config/webpack")
};

gulp.task('clean:webpack', function(callback) {
  del(['dist'], function() {
    callback()
  });
});

gulp.task('clean:node', function (callback) {
  del(['core', 'index.js'], function() {
    callback()
  })
});

gulp.task('clean:test', function(callback) {
    del(['coverage'], function() {
      callback()
    })
});

gulp.task('clean:docs', function(callback) {
    del(['docs/html'], function() {
      callback()
    })
});

gulp.task('clean', ['clean:node', 'clean:webpack', 'clean:test', 'clean:docs']);

gulp.task('build:node', ['clean:node'], function () {
    return gulp.src(["src/**/*.js", "!src/browser/**/*"])
        .pipe(babel())
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
         " -c config/esdoc.json",
      function(err) {
        callback(err);
      });
});

gulp.task('build', ['build:node', 'build:webpack', 'build:docs']);

gulp.task("watch", ["build"], function () {
    gulp.watch(["src/**/*"], ["build"]);
});

gulp.task('test', ['clean:test'], function (cb) {
  mergeStream(
    gulp.src(["src/**/*.js", "!src/browser/**/*", "!src/index.js"])
      .pipe(istanbul()),
    gulp.src(['spec/**/*.js'])
      .pipe(babel())
  ).pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src(['spec/**/*.js'])
       .pipe(jasmine({reporter: new (require('jasmine-spec-reporter'))}))
       .pipe(istanbul.writeReports()) // Creating the reports after tests ran
       //.pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } })) // Enforce a coverage of at least 90%
       .on('end', cb);
    });
});
