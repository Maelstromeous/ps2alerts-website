module.exports = function(grunt) {
    'use strict';

    grunt.initConfig( {
        concat: {
            css: {
                src: [
                    'public/bower_components/Materialize/dist/css/materialize.min.css',
                    'public/assets/css/compiled/main.css',
                    'public/assets/css/compiled/homepage.css',
                    'public/assets/css/compiled/alert.history.css'
                ],
                dest: 'public/assets/css/main.css'
            },
            js_deps : {
                src: [
                    'public/bower_components/angular/angular.min.js',
                    'public/bower_components/angular-route/angular-route.min.js',
                    'public/bower_components/jquery/dist/jquery.min.js',
                    'public/bower_components/Materalize/js/materialize.min.js',
                    'public/bower_components/angular-materialize/src/materialize.min.js',
                ],
                dest: 'public/assets/js/deps.js'
            },
            js: {
                src: [
                    'public/config.js',
                    'public/app.js',
                    'public/controllers/**/*.js',
                    'public/directives/**/*.js',
                    'public/services/**/*.js',
                    'public/assets/js/common.js',
                ],
                dest: 'public/assets/js/main.js'
            },
        },
        less: {
            development: {
                files: {
                    "public/assets/css/compiled/main.css"          : "public/assets/less/main.less",
                    "public/assets/css/compiled/homepage.css"      : "public/assets/less/homepage.less",
                    "public/assets/css/compiled/alert.history.css" : "public/assets/less/alert.history.less"
                }
            }
        },
        watch: {
            less: {
                files: ['public/assets/less/**/*.less'],
                tasks: ['css'],
                options: {
                    nospawn: true
                }
            },
            scripts: {
                files: [
                    'public/app.js',
                    'public/controllers/**/*.js',
                    'public/directives/**/*.js',
                    'public/services/**/*.js',
                    'public/assets/js/common.js'
                ],
                tasks: ['js'],
                options: {
                    atBegin: true
                }
            }
        },
        ngconstant: {
            // Options for all targets
            options: {
                space: '  ',
                wrap: '"use strict";\n\n{%= __ngModule %}',
                name: 'config',
            },
            // Environment targets
            development: {
                options: {
                    dest: 'public/config.js'
                },
                constants: {
                    ENV: {
                        environment: 'development',
                        baseUrl: 'http://192.168.33.10/ps2alerts/public',
                        apiUrl: 'http://192.168.33.10/ps2alerts-api/public/v2'
                    }
                }
            },
            staging: {
                options: {
                    dest: 'public/config.js'
                },
                constants: {
                    ENV: {
                        environment: 'staging',
                        baseUrl: 'https://staging.ps2alerts.com',
                        apiUrl: 'https://api.ps2alerts.com/v2'
                    }
                }
            },
            production: {
                options: {
                    dest: 'public/config.js'
                },
                constants: {
                    ENV: {
                        environment: 'production',
                        baseUrl: 'https://www.ps2alerts.com',
                        apiUrl: 'https://api.ps2alerts.com/v2'
                    }
                }
            },
        },
    });

    grunt.loadNpmTasks('grunt-ng-constant');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['css', 'js']);
    grunt.registerTask('envDev', ['ngconstant:development', 'concat:js']);
    grunt.registerTask('envStaging', ['ngconstant:staging', 'concat:js']);
    grunt.registerTask('envProduction', ['ngconstant:production', 'concat:js']);
    grunt.registerTask('css', ['less', 'concat:css']);
    grunt.registerTask('js', ['concat:js', 'concat:js_deps']);
};
