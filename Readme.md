# gulp-go

A gulp wrapper for golang commands. Completely inspired by gulp-go.
This aims to let users have better control of their golang environment with the build system.
Because `go run` does not solve all problems.



## Goals

    Ability to build a binary, and run it with gulp. (This allows us to easily package an app with docker.)
    

## Install

    npm install gulp-golang *not yet

## Usage

    var gulp   = require("gulp");
    var golang = require("gulp-golang");

    var go;

    gulp.task("run", function() {
      go = golang.run("main.go", ["--arg1", "value1"], {cwd: __dirname, stdio: 'inherit'});
    });

    gulp.task("devs", ["go-run"], function() {
      gulp.watch([__dirname+"/**/*.go"]).on("change", function() {
        go.restart();
      });
    });

    gulp.task("build", function() {
      golang.build("main.go");
    });

    gulp.task('spawn', function(){
      golang.spawn()
    })

    gulp.task('dev', function(callback){
      sequence('build','spawn')(callback)
    })


## License

MIT
