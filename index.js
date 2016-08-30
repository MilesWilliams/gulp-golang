var build = require("./plugin/build")
var run = require("./plugin/run")
var spawn = require("./plugin/spawn")
var ps = require("./plugin/helper").ps


module.exports = {
  ps: function () {
    return ps;
  },
  log: function (prefix) {
    prefix = (prefix || "");
    return function (data) {
      console.log(prefix, data.toString());
    };
  },
  build: function (main, output, args, opts) {
    var go = new build.GoBuild(main, output, args, opts);
    return go.build();
  },
  spawn: function (main, args, opts) {
    var go = new spawn.GoSpawn(main, args, opts);
    return go.spawn();
  },
  spawned: require("./plugin/spawn").spawned,
  run: function (main, args, opts) {
    var go = new run.GoRun(main, args, opts);
    return go.run();
  }
};
