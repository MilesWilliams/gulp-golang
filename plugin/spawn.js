var spawn = require('child_process').spawn
var path = require('path')
var log = require('./helper').log
var addps = require('./helper').addps
var delps = require('./helper').addps
var treeKill = require('tree-kill')
var lock = false
var SpawnInstance

module.exports = {
  GoSpawn: GoSpawn
}

function GoSpawn(main, args, opts) {
  this.main = main || 'main'
  if (typeof (this.main) === 'string') {
    this.main = [this.main]
  }
  this.args = args || []
  this.opts = opts || {}
}

GoSpawn.prototype.spawn = function () {
  var self = this
  var pid
  if (lock) {
    lock = false
    pid = SpawnInstance.proc.pid
    log('[' + pid + ']', 'restarting process...')
    if (!pid) {
      log('no pid:', 'exit')
      process.exit()
    }
    assasinate(self, pid)
  } else {
    var proc = this.proc = spawn(path.join(process.cwd(), require('./build').binarie()), this.args, this.opts)
    pid = proc.pid
    log('[' + pid + ']', 'spawn processs started with pid')
    spawnLogs(proc)
    lock = true
    SpawnInstance = this
    return addps(pid, this)
  }
}

function spawnLogs(proc) {
  /* Pretty print server log output */
  proc.stdout.on('data', function (data) {
    var lines = data.toString().split('\n')
    for (var l in lines) {
      if (lines[l].length) {
        log(lines[l])
      }
    }
  })

  /* Print errors to stdout */
  proc.stderr.on('data', function (data) {
    process.stdout.write(data.toString())
  })
}

function assasinate(self, pid) {
  treeKill(pid, 'SIGKILL', function (err) {
    if (!err) {
      delps(pid)
      self.spawn()
    } else {
      log(err)
      process.exit()
    }
  })
}

