"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        concat: {
            dist: {
                src: ['src/*.js', 'src/**/*.js'],
                dest: 'dist/legit.js'
            }
        },

        uglify: {
            dist: {
                files: {
                    'dist/legit.min.js': ['dist/legit.js']
                }
            }
        },

        watch: {
            js: {
                files: ['src/*.js', 'src/**/*.js'],
                tasks: ['concat']
            }
        },

        mocha_istanbul: {
            coverage: {
                src: 'test/', // the folder, not the files,
                options: {
                    mask: '**/*Test.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('coverage', ['mocha_istanbul:coverage']);
    grunt.registerTask('build', ['concat', 'uglify']);
    grunt.registerTask('default', ['build', 'watch']);
};