'use strict';

// modules
var assemble = require('fabricator-assemble');
var atImport = require('postcss-easy-import');
var atRoot = require('postcss-atroot');
var bemAtRules = require('postcss-bem');
var bemLinter = require('postcss-advanced-variables');
var browserSync = require('browser-sync');
var colorguard = require('colorguard');
var cssMQPacker = require('css-mqpacker');
var cssnano = require('cssnano');
var cssVariables = require('postcss-css-variables');
var csso = require('gulp-csso');
var currentSelector = require('postcss-current-selector');
var del = require('del');
var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var imagemin = require('gulp-imagemin');
var maps = require('postcss-map');
var nestedProps = require('postcss-nested-props').default;
var postcss	= require('gulp-postcss');
var precss = require('precss');
var prefix = require('gulp-autoprefixer');
var propertyLookup = require('postcss-property-lookup');
var reporter = require('postcss-reporter');
var rename = require('gulp-rename');
var reload = browserSync.reload;
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var suitAtRules = require('postcss-bem');
var stylelint = require('stylelint');
var webpack = require('webpack');

// configuration
var config = {
	dest: 'dist',
	dev: gutil.env.dev,
	src: {
		scripts: {
			fabricator: './src/assets/fabricator/scripts/fabricator.js',
			toolkit: './src/assets/toolkit/scripts/entry.js'
		},
		styles: {
			fabricator: 'src/assets/fabricator/styles/fabricator.scss',
			toolkit: 'src/assets/toolkit/styles/**/*.css'
		},
		images: 'src/assets/toolkit/images/**/*',
		views: 'src/toolkit/views/*.html'
	}
};


// webpack
var webpackConfig = require('./webpack.config')(config);
var webpackCompiler = webpack(webpackConfig);


// clean
gulp.task('clean', function () {
	return del([config.dest]);
});


// styles
gulp.task('styles:fabricator', function () {
	gulp.src(config.src.styles.fabricator)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(prefix('last 1 version'))
		.pipe(gulpif(!config.dev, csso()))
		.pipe(rename('f.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(config.dest + '/assets/fabricator/styles'))
		.pipe(gulpif(config.dev, reload({stream:true})));
});



gulp.task('styles:toolkit', function () {

	var mapsOptions = {
		basePath: 'src/assets/toolkit/styles',
		maps: [ 'settings.yml' ]
	};

	var reporterOptions = {
		clearMessages: true
	};

	var processors = [
		stylelint,
		atImport({
			prefix: '_'
		}),
		maps(mapsOptions),
		bemAtRules,
		atRoot,
		cssVariables,
		precss,
		currentSelector,
		nestedProps,
		prefix,
		cssMQPacker,
		cssnano,
		colorguard,
		reporter(reporterOptions)
	];

	return gulp.src(config.src.styles.toolkit)
		.pipe(gulpif(config.dev, sourcemaps.init()))
		.pipe(postcss(processors))
		.pipe(gulpif(!config.dev, csso()))
		.pipe(gulpif(config.dev, sourcemaps.write()))
		.pipe(gulp.dest(config.dest + '/assets/toolkit/styles'))
		.pipe(gulpif(config.dev, reload({stream:true})));
	});

gulp.task('styles', ['styles:fabricator', 'styles:toolkit']);


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

// images
gulp.task('images', ['favicon'], function () {
	return gulp.src(config.src.images)
		.pipe(imagemin())
		.pipe(gulp.dest(config.dest + '/assets/toolkit/images'));
});

gulp.task('favicon', function () {
	return gulp.src('./src/favicon.ico')
		.pipe(gulp.dest(config.dest));
});


var handlebarHelpers = {
	default: function (value, defaultValue) {
		return value ? value : defaultValue;
	},
	camelify: function (str) {
		return str.replace(/(?:^.|[A-Z]|\b.)/g, function(letter, index) {
			return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
		}).replace(/\s+/g, '');
	},
	capitalise: function (value) {
		return value.charAt(0).toUpperCase() + value.slice(1);
	},
	slugify: function (title) {
	  return title.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
	}
}

// assemble
gulp.task('assemble', function (done) {
	assemble({
		helpers: handlebarHelpers,
		logErrors: config.dev
	});
	done();
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

	gulp.task('styles:fabricator:watch', ['styles:fabricator']);
	gulp.watch('src/assets/fabricator/styles/**/*.scss', ['styles:fabricator:watch']);

	gulp.task('styles:toolkit:watch', ['styles:toolkit']);
	gulp.watch('src/assets/toolkit/styles/**/*.css', ['styles:toolkit:watch']);

	gulp.task('scripts:watch', ['scripts'], reload);
	gulp.watch('src/assets/{fabricator,toolkit}/scripts/**/*.js', ['scripts:watch']).on('change', webpackCache);

	gulp.task('images:watch', ['images'], reload);
	gulp.watch(config.src.images, ['images:watch']);

});


// default build task
gulp.task('default', ['clean'], function () {

	// define build tasks
	var tasks = [
		'styles',
		'scripts',
		'images',
		'assemble'
	];

	// run build
	runSequence(tasks, function () {
		if (config.dev) {
			gulp.start('serve');
		}
	});

});
