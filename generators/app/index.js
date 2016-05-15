'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      '\'Allo \'allo! Welcome to the ' + chalk.cyan('Web Machine') + '!'
    ));

    var prompts = [
      {
        type: 'list',
        name: 'packageManager',
        message: 'How would you like to manage your dependencies?',
        choices: [
          { name: 'Node', value: 'node', checked: true },
          { name: 'Bower', value: 'bower' }
        ]
      },
      {
        type: 'list',
        name: 'reloader',
        message: 'Which browser reloader would you like to use during development?',
        choices: [
          { name: 'Browser-Sync', value: 'browsersync', checked: true },
          { name: 'Livereload', value: 'livereload' }
        ]
      }
    ];

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
