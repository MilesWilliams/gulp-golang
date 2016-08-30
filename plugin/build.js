var spawn = require("child_process").spawnSync;
var util = require("gulp-util");
var notifier = require("node-notifier");
var path = require("path");
var binarie

module.exports = {
  GoBuild: GoBuild,
  build: GoBuild.build,
  binarie: function () {
    return binarie || "main"
  }
};




function GoBuild(main, output, args, opts) {
  this.main = main || "main.go";
  if (typeof (this.main) == 'string') {
    this.main = [this.main];
  }
  this.output = output || "main"
  binarie = output
  this.args = args || [];
  this.opts = opts || {};
}


GoBuild.prototype.build = function () {

  console.log(path.join(process.cwd(),this.output))
  var args = ["build"].concat("-o").concat(path.join(process.cwd(),this.output)).concat(this.main);

  args = args.concat(this.args, Array.prototype.slice.call(arguments));
  var proc = this.proc = spawn("go", args, this.opts);
  var pid = proc.pid;
  console.log("build processs started with pid", "[" + pid + "]");

  if (proc.stderr.length) {
    var lines = proc.stderr.toString()
      .split('\n').filter(function (line) {
        return line.length
      });
    lines.forEach(function (element) {
      util.log(util.colors.red(
        "Error (go install):" + element
      ));
    });
    notifier.notify({
      title: 'Error (go install)',
      message: lines
    });
    process.exit()
  }


  return this;
};
