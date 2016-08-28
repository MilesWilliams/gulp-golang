# gulp-go

[![Build Status](https://travis-ci.org/nowk/gulp-go.svg?branch=master)](https://travis-ci.org/nowk/gulp-go)
[![David DM](https://david-dm.org/nowk/gulp-go.png)](https://david-dm.org/nowk/gulp-go)

A complete wrapper for golang commands for gulp. Completely inspired by gulp-go.
This aims to let users have better control of their build system on the golang environment .


## Goals

    Ability to build a binary


## Install

    npm install gulp-golang

## Usage

    var gulp   = require("gulp");
    var golang = require("gulp-golang");

    var go;

    gulp.task("go-run", function() {
      go = golang.run("main.go", ["--arg1", "value1"], {cwd: __dirname, stdio: 'inherit'});
    });

    gulp.task("build", function() {
      golang.build("main.go","../kala", [], { cwd: __dirname  });
    });

    gulp.task("devs", ["go-run"], function() {
      gulp.watch([__dirname+"/**/*.go"]).on("change", function() {
        go.restart();
      });
    });

## License

MIT
