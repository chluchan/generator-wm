'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-wm:app', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({someAnswer: true})
      .toPromise();
  });

  it('generates a package.json', function () {
    assert.file(['package.json']);
  });

  it('generates a build file', function() {
    assert.file(['gulpfile.js']);
  });

  it('generates a src/app/html file', function() {
    assert.file(['src/app/index.html']);
  });
});
