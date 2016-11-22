'use strict'; 

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // uglify
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },

        // copy
        copy: {
            main: {
                src: ['**/*', '!**/node_modules/**', '!**/offline/**', '!**/.gitignore', '!**/package.json', '!**/.git', '!**/Gruntfile.js'],
                expand: true,
                // cwd: 'compareInflections',
                dest: 'build'
            },
        },

        // clean
        clean: ['**/build'],

        'string-replace': {
            inline: {
                files: {
                    'build/': 'index.html'
                },
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
                            replacement: '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/libbootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>'
                        },
                        {
                            pattern: '<script src="offline/jquery.min.js"></script>',
                            replacement: '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>'
                        },
                        {
                            pattern: '<script src="offline/p5.js"></script>',
                            replacement: '<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.4/p5.min.js"></script>'
                        }
                    ]
                }
            }
        },

        uglify: {
            development: {
                files: [{
                    expand: true,
                    cwd: './build/',
                    src: '**/*.js',
                    dest: './build/'
                }]
            },
            options: {
                compress: {
                    drop_console: true
                }
            }
        },

        babel: {
            options: {
                sourceMap: false,
                presets: ['es2015']
            },
            build: {
                expand: true,
                src: './build/js/*.js',
                dest: ''
            }
        },

        jshint: {
            options: {
                esnext: true
            },
            files: ['js/*.js']
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
                src: ['./*.html']
            }
        },

        htmlmin: {
            dev: {
                options: {
                    removeEmptyAttributes: true,
                    removeEmptyElements: true,
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

    grunt.registerTask('js-hint', ['jshint']);
    grunt.registerTask('html-hint', ['htmlhint']);
    grunt.registerTask('build', ['clean', 'copy', 'string-replace', 'babel', 'uglify', 'htmlmin']);
    grunt.registerTask('bb', ['htmlmin']);

};