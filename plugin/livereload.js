var gulplivereload = require('gulp-livereload');
var log = require('./helper').log;

function Livereload() {
  log('Livereload module initialization');
}

Livereload.prototype.listen = function () {
  gulplivereload.listen();
};

Livereload.prototype.reload = function () {
  setTimeout(function () {
    gulplivereload.reload();
  }, 100);
};

module.exports = {
  Livereload: Livereload
};
