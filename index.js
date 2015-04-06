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

// ToDo:
// * getCounterRange
// * getTimerRange
// * getGaugeRange

// --------------------------------------------------------------------------------------------------------------------

module.exports = function backend() {
  return new StattoBackendMemory()
}

// --------------------------------------------------------------------------------------------------------------------
