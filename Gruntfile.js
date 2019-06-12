var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '');
var packageName = "package/package" + utc;
var filesDirectory = "Common";
const sass = require('node-sass');
module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        dirs: {
            output: filesDirectory
        },
        assemble: {
            options: {
                flatten: true,
                partials: ['templates/includes/*.hbs', 'templates/includes/**/*.hbs'],
                layoutdir: 'templates/layouts',
                layout: 'default.hbs',
                helpers: ['lib/**/*.js'],
                removeHbsWhitespace: true,
                production: "false",
                filesDirectory: filesDirectory,
                version: Math.floor((Math.random() * 1000) + 1),
                images: '../Common/images'
            },
            en: {
                options: {
                    language: "en"
                },
                files: {'en/': ['templates/*.hbs']}
            },
            ar: {
                options: {
                    language: "ar"
                },
                files: {'ar/': ['templates/*.hbs']}
            },
            enProduction: {
                options: {
                    language: "en",
                    production: "true"
                },
                files: {'en/': ['templates/*.hbs']}
            },
            arProduction: {
                options: {
                    language: "ar",
                    production: "true"
                },
                files: {'ar/': ['templates/*.hbs']}
            }
        },
        sass: {
            options: {
                sourceMap: true,
                implementation: sass
            },
            dist: {
                files: {
                    '<%= dirs.output %>/css/style.css': '<%= dirs.output %>/sass/style.scss',
                }
            }
        },
        watch: {
            sass: {
                files: ['<%= dirs.output %>/sass/*.scss', '<%= dirs.output %>/sass/**/*.scss'],
                tasks: ['sass', 'rtlcss','postcss']
            },
            assemble: {
                files: ['**/*.hbs'],
                tasks: ['assemble:en', 'assemble:ar']
            },
          compass: {
                files: ['<%= dirs.output %>/images/icons/*.png'],
                tasks: ['compass'],
                options: {
                    event: ['changed', 'added', 'deleted']
                }
            },
            configFiles: {
                files: ['Gruntfile.js' ],
                options: {
                    reload: true
                }
            },
            options: {
                spawn: false
            }
        },
        cssmin: {
            options: {
                mergeIntoShorthands: false,
                roundingPrecision: -1,
                sourceMap: true
            },
            target: {
                files: {
                    '<%= dirs.output %>/css/style.min.css': ['<%= dirs.output %>/css/style.css'],
                    '<%= dirs.output %>/css/style-ar.min.css': ['<%= dirs.output %>/css/style-ar.css']
                }
            }
        },
        tinypng: {
            options: {
                apiKey: "JrouuOhPO189HHtUstQnQ1zAzJ3etgon",
                checkSigs: false,
                sigFile: 'file_sigs.json',
                summarize: true,
                showProgress: true,
                stopOnImageError: true
            },
            compress_jpg: {
                expand: true,
                src: '<%= dirs.output %>/images/**/*.{jpg,jpeg}',
                dest: 'compress-img/'
                // ext: '.min.png'
            },
            compress_png: {
                expand: true,
                src: ['<%= dirs.output %>/images/**/*.png', '!<%= dirs.output %>/images/icons/*.png'],
                dest: 'compress-img/'
                // ext: '.min.png'
            }
        },
        concat: {
            options: {
                separator: ';\n'
            },
            dist: {
                src: [
                    '<%= dirs.output %>/js/jquery/*.js',
                    '<%= dirs.output %>/js/lib/*.js',
                    '<%= dirs.output %>/js/default.js'
                ],
                dest: '<%= dirs.output %>/js/app.js'
            }
        },
        uglify: {
            my_target: {
                files: {
                    '<%= dirs.output %>/js/app.min.js': '<%= dirs.output %>/js/app.js'
                }
            }
        },
        compass: {                  // Task
            dist: {                   // Target
                options: {
                    config: 'config.rb',
                    force: true,
                    sassDir: '<%= dirs.output %>/sass/globals/',
                    cssDir: '<%= dirs.output %>/css/',
                    environment: 'development'
                }
            }
        },
        htmlmin: {                                     // Task
            en: {
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },// Another target
                files: [{
                    expand: true,
                    cwd: 'en/',
                    src: ['*.html'],
                    dest: 'en/'
                }]
            },
            ar: {
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },// Another target
                files: [{
                    expand: true,
                    cwd: 'ar/',
                    src: ['*.html'],
                    dest: 'ar/'
                }]
            }
        },
        zip: {
            'zip': {
                src: ['<%= dirs.output %>/**/*', 'en/**/*', 'ar/**/*'],
                dest: packageName + ".zip"
            }
        },
        rtlcss: {
            myTask: {
                // task options
                options: {
                    // generate source maps
                    // autoRename: true,
                    map: {inline: false},
                    // rtlcss options
                    opts: {
                        clean: false
                    },
                    // rtlcss plugins
                    plugins: [],
                    // save unmodified files
                    saveUnmodified: true,
                },
                expand: true,
                cwd: '<%= dirs.output %>/css',
                //dest: 'rtl',
                //files: {
                //    'styles-rtl.css': 'styles.css',
                //},
                src: ['style.css'],
                dest: '<%= dirs.output %>/css',
                ext: '-ar.css'
            }
        },
        clean: {
            build: {
                src: ['ar/*.html', 'en/*.html', '<%= dirs.output %>/js/app.js', '<%= dirs.output %>/js/app.min.js']
            }
        },
        postcss: {
            prefixes: {
                options: {
                    map: {
                        inline: false
                    },
                    processors: [
                        require('autoprefixer')({browsers: 'last 4 versions'}), // add vendor prefixes
                        require('postcss-flexbugs-fixes')()
                    ],
                },
                files: [{
                    expand: true,
                    cwd: '<%= dirs.output %>/css/',
                    src: ['*.css','!icons.css'],
                    dest: '<%= dirs.output %>/css/'
                }]
            },
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'Common/css/*.css',
                        'Common/js/*.js',
                        'en/*.html'
                    ]
                },
                options: {
                    server: './',
                    watchTask: true
                }
            }
        }
    });
    // Load the  plugin.
    grunt.loadNpmTasks('grunt-assemble');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-tinypng');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
 //   grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-rtlcss');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-postcss');
    // grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.registerTask('default', ['watch']);
    grunt.registerTask(
        'build',
        [
            'clean',
            'assemble:enProduction',
            'assemble:arProduction',
            'htmlmin',
      //      'compass',
            'sass',
            'rtlcss',
            'postcss',
            'cssmin',
            'concat',
            'uglify'
            // 'imagemin'
        ]
    );
    grunt.registerTask(
        'create',
        [
            'clean',
            'assemble:en',
            'assemble:ar',
        //    'compass',
            'sass',
            'rtlcss',
            'postcss'
        ]
    );
    grunt.registerTask(
        'createPackage',
        [
            'create',
            'zip'
        ]
    );
    // define sync task
    grunt.registerTask('sync',
        [
            'browserSync',
            'watch'
        ]
    );
};