'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the stellar ' + chalk.red('generator-wm') + ' generator!'
    ));

    var prompts = [{
      type: 'list',
      name: 'packageManager',
      message: 'How would you like to manage your dependencies?',
      choices: [
        { name: 'Node', value: 'node', checked: true },
        { name: 'Bower', value: 'bower' }
      ]
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  },

  writing: function () {
    var self = this;
    function writeWithProps(path) {
      self.fs.copyTpl(
        self.templatePath(path),
        self.destinationPath(path),
        self.props
      );
    }

    writeWithProps('package.json');
    writeWithProps('gulpfile.js');
    writeWithProps('src/index.html');

    if (this.props.packageManager == 'bower') {
      writeWithProps('bower.json');
    }
  },

  install: function () {
    this.installDependencies({ npm: true, bower: this.props.packageManager == 'bower' });
  }
});
