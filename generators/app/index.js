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
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('gulpfile.js'),
      this.destinationPath('gulpfile.js'),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('src/index.html'),
      this.destinationPath('src/index.html'),
      this.props
    );

    if (this.props.packageManager == 'bower') {
      this.fs.copyTpl(
        this.templatePath('bower.json'),
        this.destinationPath('bower.json'),
        this.props
      );
    }
  },

  install: function () {
    this.installDependencies({ npm: true, bower: this.props.packageManager == 'bower' });
  }
});
