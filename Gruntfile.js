'use strict'; 

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // copy
        copy: {
            main: {
                expand: true,
                cwd: './src',
                src: ['./**', '!./offline/**', '!./data/**'],
                dest: './build'
            },
        },

        // concat
        concat: {
            js: {
                src: [ // in this order...
                    './build/js/jquery.flot.min.js',
                    './build/js/regression.min.js',
                    './build/js/recorder.js',
                    './build/js/pitch-detect.js',
                    './build/js/main.js'
                ],
                dest: './build/js/concat.js'
            },
            css: {
                src: './build/css/*.css',
                dest: './build/css/concat.css'
            }
        },


        // clean
        clean: ['./build'],

        'string-replace': {
            dist: {
                files: [{
                    expand: true,
                    cwd: './build',
                    src: '*.html',
                    dest: './build'
                }],
                options: {
                    replacements: [
                        {
                            pattern: '<link rel="stylesheet" href="offline/bootstrap-theme.css">',
                            replacement: '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">'
                        },
                        {
                            pattern: '<link rel="stylesheet" href="offline/bootstrap.css">',
                            replacement: '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">'
                        },
                        {
                            pattern: '<script src="offline/bootstrap.js"></script>',
                            replacement: '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>'
                        },
                        {
                            pattern: '<script src="offline/jquery.min.js"></script>',
                            replacement: '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>'
                        },
                        {
                            pattern: '<script src="offline/p5.js"></script>',
                            replacement: '<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.4/p5.min.js"></script>'
                        },
                        {
                            pattern: '<script src="lib/jquery.flot.min.js"></script><script src="lib/regression.min.js"></script><script src="lib/recorder.js"></script><script src="js/pitch-detect.js"></script><script src="js/main.js"></script>',
                            replacement: '<script src="js/concat.min.js"></script>'
                        },
                        {
                            pattern: '<link rel="stylesheet" type="text/css" href="css/main.css">',
                            replacement: '<link rel="stylesheet" type="text/css" href="css/concat.css">'
                        }
                    ]
                }
            }
        },

        uglify: {
            development: {
                files: [{
                    // expand: true,
                    // cwd: './build/',
                    src: 'build/js/concat.js',
                    dest: 'build/js/concat.min.js'
                }]
            },
            options: {
            }
        },

        babel: {
            options: {
                sourceMap: false,
                presets: ['es2015']
            },
            build: {
                expand: true,
                src: 'build/js/concat.js',
                dest: ''
            }
        },

        jshint: {
            options: {
                esnext: true
            },
            files: ['src/js/*.js']
        },

        htmlhint: {
            templates: {
                options: {
                    'attr-lower-case': true,
                    'attr-value-not-empty': true,
                    'tag-pair': true,
                    'tagname-lowercase': true,
                    'id-class-value': true,
                    'id-class-unique': true,
                    'src-not-empty': true,
                    'img-alt-required': true
                },
                src: ['./src/*.html']
            }
        },

        htmlmin: {
            dev: {
                options: {
                    removeRedundantAttributes: true,
                    removeComments: true,
                    removeOptionalTags: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    src: './build/*.html',
                    dest: ''
                }]
            }
        }
    });



    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-htmlhint');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('js-hint', ['jshint']);
    grunt.registerTask('html-hint', ['htmlhint']);
    grunt.registerTask('build', ['clean', 'copy', 'string-replace', 'concat', 'babel', 'uglify', 'htmlmin']);

};