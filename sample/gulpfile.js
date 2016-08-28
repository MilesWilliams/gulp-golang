var path = require("path");
var gulp = require("gulp");
var sequence = require("gulp-sequence");

var golang = require("../");

var go;

function out(prefix) {
  prefix = (prefix || "");
  return function(data) {
    console.log(prefix, data.toString());
  };
}

gulp.task("build", function() {
  golang.build("main.go","../kala", [], {
    cwd:       __dirname,
    onStdout:  out(),
    onStderr:  out("[error]"),
    onClose:   out("close"),
    onExit:    out("exit")
  });
});


gulp.task('spawn', function(){
  golang.spawn()
})



gulp.task('dev', function(callback){
  sequence('build','spawn')(callback)
})




gulp.task("devs", ["go-run"], function() {
  gulp.watch([__dirname+"/**/*.go"]).on("change", function() {
    go.restart();
  });
});
