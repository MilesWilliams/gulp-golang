var logPrefix = "[golang-run]";




function log() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(logPrefix);
  console.log.apply(console, args);
}


// ps is a collection object to hold references to running GoRuns
var ps = {};

function delps(pid) {
  console.log(ps)
  console.log(ps[pid])
  console.log("sdfdsfdsf")
  delete ps[pid];

  console.log(ps)
}

function addps(pid, go) {
  ps[pid] = go;
  return go;
}



// fshut provides a method to kill running processes started through GoRuns
// This is not a general shutdown method, but a way to handle shutdowns when
// gulp exits due to an uncaughtException.
var fshut = function (callback) {
  var keys = Object.keys(ps);
  if (keys.length === 0) {
    if ("function" === typeof callback) {
      callback();
    }
    return;
  }

  var go = ps[keys[0]];
  if (go) {
    go.stop(function () {
      fshut(callback); // shutdown the next process
    });
  }
};

process.on("uncaughtException", function (err) {
  log("uncaught exception", err);
  log("forcing shutdown");
  fshut(function () {
    log("forcing shutdown: complete");
    process.exit(1);
  });
});

module.exports = {
  log: log,
  addps: addps,
  delps: delps,
  ps:ps
}