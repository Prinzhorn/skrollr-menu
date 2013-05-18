module.exports = function(grunt) {
	//Configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json') ,
		jshint: {
			options: {
				smarttabs: false,
				curly: true,
				immed: true,
				latedef: true,
				noarg: true,
				quotmark: 'single',
				undef: true,
				unused: true,
				strict: true,
				trailing: true,
				globals: {
					window: true,
					document: true,
					navigator: true
				}
			},
			all: ['src/**/*.js']
		},
		uglify: {
			options: {
				banner: '/*! skrollr-menu <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>) | Alexander Prinzhorn - https://github.com/Prinzhorn/skrollr-menu | Free to use under terms of MIT license */\n'
			},

			all: {
				files: {
					'dist/skrollr.menu.min.js': 'src/skrollr.menu.js',
				}
			}
		}
	});

	//Dependencies.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	//Tasks.
	grunt.registerTask('default', ['jshint', 'uglify']);
};