
var spawn = require("child_process").spawn;
var path = require("path");

module.exports = {
  GoSpawn: GoSpawn
};



function GoSpawn(main, args, opts) {
  this.main = main || "main.go";
  if (typeof (this.main) == 'string') {
    this.main = [this.main];
  }
  this.args = args || [];
  this.opts = opts || {};
}


GoSpawn.prototype.spawn = function () {

  var args
  args = [].concat(this.args, Array.prototype.slice.call(arguments));
  var proc = this.proc = spawn(path.join(process.cwd(),require("./build").binarie()), args, this.opts);
  var pid = proc.pid;
  console.log("build processs started with pid", "[" + pid + "]");



  /* Pretty print server log output */
  proc.stdout.on('data', function (data) {
    var lines = data.toString().split('\n');
    for (var l in lines)
      if (lines[l].length)
        util.log(lines[l]);
  });

  /* Print errors to stdout */
  proc.stderr.on('data', function (data) {
    process.stdout.write(data.toString());
  });


  return this;
};
