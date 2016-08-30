# gulp-golang

A gulp wrapper for golang commands. Completely inspired by [gulp-go](www.google.com).
This aims to let users have better control of their golang environment with the build system.
Because `go run` does not solve all problems.



## Goals

Build a binary, either with `go build`or `go install` and run it with gulp.
(This allows us to easily package an app with docker.)

## Install

    npm install gulp-golang *not yet

## Usage

    var gulp   = require("gulp");
    var golang = require("gulp-golang");

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


## License

MIT
