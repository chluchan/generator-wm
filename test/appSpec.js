'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

function invoke(f) {
  return function () {
    f();
  };
}

describe('generator-wm:app', function () {
  describe('node support', function () {
    before(function (done) {
      return helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts({packageManager: 'node'})
        .toPromise()
        .then(invoke(done));
    });

    it('uses node_modules for dependency management', function () {
      assert.fileContent('./gulpfile.js', /var dependenciesLocation = 'node_modules';/);
      assert.fileContent('./package.json', /"bootstrap":/);
      assert.fileContent('./package.json', /"jquery":/);
      assert.noFile(['bower.json']);
    });
  });

  describe('bower support', function () {
    before(function (done) {
      return helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts({packageManager: 'bower'})
        .toPromise()
        .then(invoke(done));
    });

    it('uses bower_components for dependency management', function () {
      assert.fileContent('./gulpfile.js', /var dependenciesLocation = 'bower_components';/);
      assert.fileContent('./bower.json', /"bootstrap":/);
      assert.fileContent('./bower.json', /"jquery":/);
      assert.noFileContent('./package.json', /"bootstrap":/);
      assert.noFileContent('./package.json', /"jquery":/);
    });
  });

  describe('browser-sync support', function () {
    before(function (done) {
      return helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts({reloader: 'browsersync', styles: 'sass'})
        .toPromise()
        .then(invoke(done));
    });

    it('uses browser sync for reloading', function () {
      assert.fileContent('./gulpfile.js', /browserSync = require\('browser-sync'\)\.create()/);
      assert.fileContent('./gulpfile.js', /browserSync\.init/);
      assert.fileContent('./gulpfile.js', /browserSync\.reload/);
      assert.fileContent('./gulpfile.js', /browserSync\.stream\(\)/);
      assert.fileContent('./package.json', /"browser-sync":/);
    });
  });

  describe('livereload support', function () {
    before(function (done) {
      return helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts({reloader: 'livereload'})
        .toPromise()
        .then(invoke(done));
    });

    it('uses browser sync for reloading', function () {
      assert.fileContent('./gulpfile.js', /server = require\('gulp-server-livereload'\)/);
      assert.fileContent('./gulpfile.js', /gulp\.src\('build'\)\.pipe\(server\({/);
      assert.fileContent('./package.json', /"gulp-server-livereload":/);

      assert.noFileContent('./gulpfile.js', /browserSync = require\('browser-sync'\)\.create()/);
      assert.noFileContent('./gulpfile.js', /browserSync\.init/);
      assert.noFileContent('./gulpfile.js', /browserSync\.reload/);
      assert.noFileContent('./gulpfile.js', /browserSync\.stream\(\)/);
      assert.noFileContent('./package.json', /"browser-sync":/);
    });
  });

  describe('sass support', function () {
    before(function (done) {
      return helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts({packageManager: 'node', styles: 'sass'})
        .toPromise()
        .then(invoke(done));
    });

    it('compiles sass into css', function () {
      assert.fileContent('./gulpfile.js', /pipe\(sass\({/);
      assert.fileContent('./package.json', /"gulp-sass":/);
      assert.fileContent('./package.json', /"bootstrap-sass":/);

      assert.file(['src/app.scss']);
      assert.file(['src/_theme.scss']);
    });
  });

  describe('less support', function () {
    before(function (done) {
      return helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts({packageManager: 'node', styles: 'less'})
        .toPromise()
        .then(invoke(done));
    });

    it('compiles less into css', function () {
      assert.noFileContent('./gulpfile.js', /sass = require\('gulp-sass'\)/);
      assert.noFileContent('./gulpfile.js', /gulp.task\('sass'/);
      assert.noFileContent('./package.json', /"gulp-sass":/);
      assert.noFileContent('./package.json', /"bootstrap-sass":/);

      assert.fileContent('./gulpfile.js', /less = require\('gulp-less'\)/);
      assert.fileContent('./gulpfile.js', /.pipe\(less\({/);
      assert.fileContent('./package.json', /"gulp-less":/);

      assert.file(['src/app.less']);
      assert.file(['src/theme.less']);
    });
  });

  describe('default setup', function () {
    before(function (done) {
      return helpers.run(path.join(__dirname, '../generators/app'))
        .toPromise()
        .then(invoke(done));
    });

    it('generates a web app', function () {
      assert.file(['package.json']);
      assert.file(['src/index.html']);
      assert.file(['gulpfile.js']);
      assert.file(['.editorconfig']);
      assert.file(['.gitignore']);
    });
  });
});
