var path = require("path");
var gulp = require("gulp");
var sequence = require("gulp-sequence");
var golang = require("../");


var go;
gulp.task("run", function() {
  go = golang.run("main.go", ["--arg1", "value1"], {cwd: __dirname, stdio: 'inherit'});
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




gulp.task("devs", ["go-run"], function() {
  gulp.watch([__dirname+"/**/*.go"]).on("change", function() {
    go.restart();
  });
});
