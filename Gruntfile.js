module.exports = function(grunt) {
  var path = require('path');

  require('load-grunt-config')(grunt, {
    configPath: path.join(process.cwd(), 'gruntconfig/config'),
    jitGrunt: {
      customTasksDir: 'gruntconfig/tasks'
    }
  });
};
