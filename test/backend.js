// --------------------------------------------------------------------------------------------------------------------
//
// statto-backend-memory/test/backend.js
// 
// Copyright 2015 Tynio Ltd.
//
// --------------------------------------------------------------------------------------------------------------------

// npm
var test = require('tape')
var stattoBackendTest = require('statto-backend/test/backend.js')

// local
var stattoBackendMemory = require('../')

// --------------------------------------------------------------------------------------------------------------------

// create a backend
var backend = stattoBackendMemory()

// now run the tests
stattoBackendTest(backend, test)

// --------------------------------------------------------------------------------------------------------------------
