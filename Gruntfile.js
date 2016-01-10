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
            js: {
                src: [
                    'public/bower_components/angular/angular.min.js',
                    'public/bower_components/angular-route/angular-route.min.js',
                    'public/bower_components/Materalize/js/materialize.min.js',
                    'public/app.js',
                    'public/controllers/**/*.js',
                    'public/directives/**/*.js',
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
                    'public/controllers/**/*.js',
                    'public/directives/**/*.js'
                ],
                tasks: ['js'],
                options: {
                    atBegin: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['css', 'js']);
    grunt.registerTask('css', ['less', 'concat:css']);
    grunt.registerTask('js', ['concat:js']);
};
