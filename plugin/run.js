var log = require('./helper').log;
var addps = require('./helper').addps;
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var pstree = require('ps-tree');
var delps = require('./helper').addps;

module.exports = {
  GoRun: GoRun
};


// GoRun is the runner class for a single `go run ...` process
function GoRun(main, args, opts) {
  this.main = main || 'main.go';
  if (typeof (this.main) === 'string') {
    this.main = [this.main];
  }
  this.args = args || [];
  this.opts = opts || {};
}

GoRun.prototype._spawn = function () {
  var args = Array.prototype.slice.call(arguments);
  log('starting process...');

  if (this.opts.godep) {
    log('using `godep go`');
    args.unshift('go');
    return spawn('godep', args, this.opts);
  } else {
    return spawn('go', args, this.opts);
  }
};

var noop = function () {
  //
};

GoRun.prototype.run = function () {
  var args = ['run'].concat(this.main);
  args = args.concat(this.args, Array.prototype.slice.call(arguments));
  var proc = this.proc = this._spawn.apply(this, args);
  var pid = proc.pid;
  log('[' + pid + ']', 'processs started');
  if (proc.stdout) {
    proc.stdout.on('data', this.opts.onStdout || noop);
  }
  if (proc.stderr) {
    proc.stderr.on('data', this.opts.onStderr || noop);
  }
  proc.on('close', this.opts.onClose || noop);
  proc.on('exit', this.opts.onExit || noop);

  return addps(pid, this);
};

GoRun.prototype._stop = function (callback) {
  if (!this.proc.pid) {
    log('no pid:', 'exit');
    callback();
    return;
  }

  var pid = this.proc.pid;
  pstree(pid, function (err, children) {
    var i = 0;
    var len = children.length;
    if (err) {
      process.exit();
    }
    var kill = function (n) {
      var child = children[n];
      if (!child) {
        callback();
        return;
      }
      exec('kill ' + child.PID, function () {
        i++;
        if (i === len) {
          log('[' + pid + ']', 'process stopped');

          callback();
          return;
        }
        kill(i);
      });
    };
    kill(i);
  });
};

GoRun.prototype.stop = function (callback) {
  if (typeof callback !== 'function') {
    callback = noop;
  }
  var pid = this.proc.pid;
  log('[' + pid + ']', 'stopping process...');
  var fn = function () {
    delps(pid);
    callback();
  };
  this._stop(fn);
};

GoRun.prototype.restart = function () {
  var pid = this.proc.pid;
  log('[' + pid + ']', 'restarting process...');
  var self = this;
  self.stop(function () {
    self.run();
  });
};
