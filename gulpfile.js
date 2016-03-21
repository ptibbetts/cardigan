'use strict';

// modules
var atImport = require('postcss-easy-import');
var browserSync = require('browser-sync');
var cssMQPacker = require('css-mqpacker');
var cssnano = require('cssnano');
var csso = require('gulp-csso');
var del = require('del');
var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var postcss	= require('gulp-postcss');
var precss = require('precss');
var prefix = require('gulp-autoprefixer');
var reporter = require('postcss-reporter');
var rename = require('gulp-rename');
var reload = browserSync.reload;
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var suitAtRules = require('postcss-bem');
var webpack = require('webpack');


// configuration
var config = {
	dev: gutil.env.dev,
	src: {
		scripts: './src/assets/scripts/entry.js',
		styles: './src/assets/styles/**/*.css'
	},
	dest: 'dist'
};


// webpack
var webpackConfig = require('./webpack.config')(config);
var webpackCompiler = webpack(webpackConfig);


// clean
gulp.task('clean', function () {
	return del([config.dest]);
});


// styles
gulp.task('styles', function () {

		var processors = [
			atImport({
				prefix: '_'
			}),
			suitAtRules,
			cssMQPacker,
			cssnano,
			prefix,
			precss,
			reporter
		];

    return gulp.src(config.src.styles)
				.pipe(gulpif(config.dev, sourcemaps.init()))
				.pipe(postcss(processors))
				.pipe(gulpif(!config.dev, csso()))
				.pipe(gulpif(config.dev, sourcemaps.write()))
				.pipe(gulp.dest(config.dest + '/assets/styles'))
				.pipe(gulpif(config.dev, reload({stream:true})));
});

// scripts
gulp.task('scripts', function (done) {
	webpackCompiler.run(function (error, result) {
		if (error) {
			gutil.log(gutil.colors.red(error));
		}
		result = result.toJson();
		if (result.errors.length) {
			result.errors.forEach(function (error) {
				gutil.log(gutil.colors.red(error));
			});
		}
		done();
	});
});

// assemble
gulp.task('assemble', function() {
    gulp.src('./src/index.html')
    // Perform minification tasks, etc here
    .pipe(gulp.dest('./dist/'));
});

// server
gulp.task('serve', function () {

	browserSync({
		server: {
			baseDir: config.dest
		},
		notify: false,
		logPrefix: 'CARDIGAN'
	});

	/**
	 * Because webpackCompiler.watch() isn't being used
	 * manually remove the changed file path from the cache
	 */
	function webpackCache(e) {
		var keys = Object.keys(webpackConfig.cache);
		var key, matchedKey;
		for (var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
			key = keys[keyIndex];
			if (key.indexOf(e.path) !== -1) {
				matchedKey = key;
				break;
			}
		}
		if (matchedKey) {
			delete webpackConfig.cache[matchedKey];
		}
	}

	gulp.task('assemble:watch', ['assemble'], reload);
	gulp.watch('src/**/*.{html,md,json,yml}', ['assemble:watch']);

	gulp.task('styles:watch', ['styles']);
	gulp.watch('src/assets/styles/**/*.css', ['styles:watch']);

	gulp.task('scripts:watch', ['scripts'], reload);
	gulp.watch('src/assets/scripts/**/*.js', ['scripts:watch']).on('change', webpackCache);

});


// default build task
gulp.task('default', ['clean'], function () {

	// define build tasks
	var tasks = [
		'styles',
		'scripts',
		'assemble'
	];

	// run build
	runSequence(tasks, function () {
		if (config.dev) {
			gulp.start('serve');
		}
	});

});
