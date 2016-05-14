'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-wm:app', function () {
  describe('node support', function () {
    before(function() {
      return helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts({packageManager: 'node'})
        .toPromise();
    });

    it('uses node_modules for dependency management', function() {
      assert.fileContent('./gulpfile.js', /var dependenciesLocation = 'node_modules';/);
      assert.fileContent('./package.json', /"bootstrap":/);
      assert.fileContent('./package.json', /"jquery":/);
      assert.noFile(['bower.json']);
    })
  });

  describe('bower support', function () {
    before(function() {
      return helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts({packageManager: 'bower'})
        .toPromise();
    });

    it('uses bower_components for dependency management', function() {
      assert.fileContent('./gulpfile.js', /var dependenciesLocation = 'bower_components';/);
      assert.fileContent('./bower.json', /"bootstrap":/);
      assert.fileContent('./bower.json', /"jquery":/);
      assert.noFileContent('./package.json', /"bootstrap":/);
      assert.noFileContent('./package.json', /"jquery":/);
    })
  });

  describe('default setup', function() {
    before(function() {
      return helpers.run(path.join(__dirname, '../generators/app'))
        .toPromise();
    });

    it('generates a web app', function() {
      assert.file(['package.json']);
      assert.file(['src/index.html']);
      assert.file(['gulpfile.js']);
    });
  });
});
