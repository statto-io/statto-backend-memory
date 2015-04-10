// --------------------------------------------------------------------------------------------------------------------
//
// statto-backend-memory/index.js
// 
// Copyright 2015 Tynio Ltd.
//
// --------------------------------------------------------------------------------------------------------------------

// core
var util = require('util')
var crypto = require('crypto')

// npm
var through = require('through')
var stattoBackend = require('statto-backend')

// --------------------------------------------------------------------------------------------------------------------
// module level

function noop(){}

// --------------------------------------------------------------------------------------------------------------------
// constructor

function StattoBackendMemory() {
  // this holds all of the raw stats
  this.raw = {}

  // this holds all of the merged stats
  this.stats = {}
}

util.inherits(StattoBackendMemory, stattoBackend.StattoBackendAbstract)

// --------------------------------------------------------------------------------------------------------------------
// methods

StattoBackendMemory.prototype.addRaw = function addRaw(raw, callback) {
  var self = this
  callback = callback || noop

  var hash = self._getHash(raw)
  var ts = raw.ts

  // store and emit on the next tick
  process.nextTick(function() {
    // save these stats to memory
    if ( !self.raw[ts] ) {
      self.raw[ts] = {}
    }

    // emit 'stored'
    self.raw[ts][hash] = raw
    self.emit('stored')

    return callback()
  })
}

StattoBackendMemory.prototype.getRaws = function getStats(date, callback) {
  var self = this

  process.nextTick(function() {
    date = self._datify(date)
    if ( !date ) {
      return callback(new Error('Unknown date type : ' + typeof date))
    }
    var ts = date.toISOString()

    if ( !self.raw[ts] ) {
      return callback(null, [])
    }

    var raws = []
    Object.keys(self.raw[ts]).forEach(function(hash) {
      raws.push(self.raw[ts][hash])
    })

    callback(null, raws)
  })
}

StattoBackendMemory.prototype.setStats = function setStats(stats, callback) {
  var self = this
  callback = callback || noop

  var ts = stats.ts

  // store and emit on the next tick
  process.nextTick(function() {
    // save these stats to memory
    self.stats[ts] = stats
    return callback()
  })
}

StattoBackendMemory.prototype.getStats = function getStats(date, callback) {
  var self = this

  process.nextTick(function() {
    date = self._datify(date)
    if ( !date ) {
      return callback(new Error('Unknown date type : ' + typeof date))
    }
    var ts = date.toISOString()

    if ( !self.stats[ts] ) {
      return callback(null)
    }

    callback(null, self.stats[ts])
  })
}

StattoBackendMemory.prototype.createStatsReadStream = function createStatsReadStream(from, to, callback) {
  // * from - greater than or equal to (always included)
  // * to - less than (therefore never included)
  var self = this

  from = self._datify(from)
  to   = self._datify(to)
  // if ( !from ) {
  //   return process.nextTick(function() {
  //     callback(new Error("Unknown 'from' type : " + typeof from))
  //   })
  // }
  // if ( !to ) {
  //   return process.nextTick(function() {
  //     callback(new Error("Unknown 'to' type : " + typeof to))
  //   })
  // }
  var ts1 = from.toISOString()
  var ts2 = to.toISOString()

  // let's loop
  var stream = through()

  var timestamps = Object.keys(self.stats).sort()
  process.nextTick(function() {
    for(var i = 0; i < timestamps.length; i++) {
      if ( timestamps[i] >= ts1 && timestamps[i] < ts2 ) {
        stream.queue(self.stats[timestamps[i]])
      }
    }
    // end the stream
    stream.emit('end')
    stream.emit('close')
  })

  return stream
}

// ToDo:
// * getCounterRange
// * getTimerRange
// * getGaugeRange

// --------------------------------------------------------------------------------------------------------------------

module.exports = function backend() {
  return new StattoBackendMemory()
}

// --------------------------------------------------------------------------------------------------------------------
