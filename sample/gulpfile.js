var gulp = require('gulp');
var sequence = require('gulp-sequence');
var golang = require('../');
var watch = require('gulp-watch');


gulp.task('build', function () { golang.build('main.go', "sample") });
gulp.task('spawn', function () { golang.spawn() })
gulp.task('run', function (callback) { sequence('build', 'spawn')(callback) })

gulp.task('watch', function (callback) {
  golang.livereload().listen()
  gulp.start('run')

  watch('**/*.go', function () {
    gulp.start('run')
    golang.livereload().reload()
  });
});



