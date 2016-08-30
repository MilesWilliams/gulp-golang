var path = require("path");
var gulp = require("gulp");
var sequence = require("gulp-sequence");
var golang = require("../");
var watch = require('gulp-watch');


gulp.task("build", function () {
  golang.build("main.go");
});


gulp.task('spawn', function () {
  golang.spawn()
})


gulp.task('watch', (callback) => {
		sequence('build', 'spawn')(callback)


  watch('**/*.go', () => {
    gulp.start('build')
    golang.spawned().refresh()
  });
});



