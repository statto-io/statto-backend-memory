# statto-backend-leveldb #

A memory based statto backend for testing purposes.

## Synopsis ##

See the example file: `example/server.js`.

## Description ##

This is an example statto backend such that it implements the bare basics as an example of what you can do and to just
get something working. It stores all information in memory and does not persist it anywhere. See also `statto-backend-fs` as
another example of something just as simple (but slow) but which does at least persist all data.

It is also an example backend which the tests in `statto-backend` can test for compliance.

## Author ##

Written by [Andrew Chilton](http://chilts.org/) - [Twitter](https://twitter.com/andychilton).

Written for [Tynio](https://tyn.io/).

## License ##

The MIT License (MIT). Copyright 2015 Tynio Ltd.

(Ends)
