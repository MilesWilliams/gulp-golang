var spawn = require("child_process").spawn;
var path = require("path");
var log = require("./helper").log
var addps = require("./helper").addps
var delps = require("./helper").addps
var ps = require("./helper").ps
var GoBuild = require("./build").GoBuild
var pstree = require("ps-tree")
var treeKill = require("tree-kill");

var spawned

module.exports = {
  GoSpawn: GoSpawn,
  spawned: function(){
    return spawned
  }
};


function GoSpawn(main, args, opts) {
  this.main = main || "main";
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

  spawned = addps(pid,this)
  return spawned;
};


GoSpawn.prototype.refresh = function () {
  var pid = this.proc.pid;
  log("[" + pid + "]", "restarting process...");

  var self = this;
  self.stop(function () {
    self.spawn()
  });
};


GoSpawn.prototype._stop = function (callback) {
   if (!!!this.proc.pid) {
    log("no pid:", "exit");

    callback();
    return;
  }

  var pid = this.proc.pid;
  treeKill(pid, 'SIGKILL', function(err) {
    if(err) {
      log(err);
	  callback();
    } else {
      log("["+pid+"]", "process stopped");
      callback();
    }
  });

};

GoSpawn.prototype.stop = function (callback) {
  if ("function" !== typeof callback) {
    callback = noop;
  }

  var pid = this.proc.pid;
  log("[" + pid + "]", "stopping process...");

  var self = this;
  var fn = function () {
    delps(pid);

    callback();
  };

  this._stop(fn);
};