var gulp = require('gulp');
var sequence = require('gulp-sequence');
var golang = require('../');
var watch = require('gulp-watch');



gulp.task('build', function () { golang.build('main.go',"../dist/dev/sample") });

gulp.task('spawn', function () { golang.spawn() })


gulp.task('watch', function (callback)  {
    golang.livereload().listen()
		sequence('build', 'spawn')(callback)

  watch('**/*.go', function () {
		sequence('build', 'spawn')()
  });
});



