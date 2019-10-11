module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON("package.json"),
    banner: "/*!\n"
      + " * <%= pkg.title %> - v<%= pkg.version %>\n"
      + " *\n"
      + " * Copyright (c) <%= grunt.template.today('yyyy') %> <%= pkg.author.name %> <<%= pkg.author.url %>>\n"
      + " * Released under the <%= pkg.license %> license\n"
      + " *\n"
      + " * Date: <%= grunt.template.today('yyyy-mm-dd') %>\n"
      + " */\n",
    // Task configuration.
    concat: {
      options: {
        banner: "<%= banner %>",
        stripBanners: true
      },
      dist: {
        src: [
          "src/intro.js",
          "src/constructors/Kemystry.js",
          "src/constructors/Beaker.js",
          "src/constructors/Pipette.js",
          "src/constructors/Tube.js",
          "src/constructors/TubeRack.js",
          "src/constructors/Kemycal.js",
          "src/constructors/KemycalMixture.js",
          "src/Lab.js",
          "src/Outro.js"
        ],
        dest: "dist/<%= pkg.name %>.js"
      }
    },
    uglify: {
      options: {
        banner: "<%= banner %>",
        mangle: false
      },
      dist: {
        options: {
          sourceMap: true
        },
        files: {
          "dist/<%= pkg.name %>.min.js":["<%= concat.dist.dest %>"]
        }
      }
    },
    jshint: {
      options: grunt.file.readJSON(".jshintrc"),
      dist: {
        src: "<%= concat.dist.dest %>"
      }
    },
    watch: {
      scripts: {
        files: ["Gruntfile.js", "src/**/*.js"],
        tasks: ["concat", "uglify", "jshint"],
      },
      gruntfile: {
        files: ["Gruntfile.js"],
        tasks: ["default"],
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-jshint");

  // Default task.
  grunt.registerTask("default", ["concat", "uglify", "jshint", "watch"]);

};
