'use strict';
const gulp = require('gulp');

// CSS
const cleanCSS = require('gulp-clean-css');

// UTILS
const concat = require('gulp-concat');
const gutil = require('gulp-util');

// SCSS
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');

// JS
const order = require('gulp-order');
const minify = require('gulp-minify');
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');


// livereloading
const browserSync = require('browser-sync').create();
const nodemon = require('gulp-nodemon')

// ===============================
// GET CONFIG
// ===============================
const nconf = require('nconf')
nconf.argv()
	.env()
	.add('user', {
		file: __dirname + '/config/development.json',
		type: 'file'
	})


// ===============================
// GLOBAL OPTIONS
// ===============================
const options = {
	minify: {
		noSource: true,
		ext: { 
			min: '.js' 
		}
	},
	uglify: {
		ie8: true,
		safari10: true
	},
	babel: {
		presets: ['@babel/env']
	},
	scss: {
		outputStyle: 'compressed'
	},
	cleancss: {
		compatibility: 'ie8'
	}
}


// ===============================
// FUNCTIONS
// ===============================
function jsErrHandler(err) {
	gutil.log(gutil.colors.red('[Error]'), err.toString());
	console.error(err.message);
	this.emit('end');
}

const jsDependency = ( 
	source
	, dest
	, filename = 'bundledependency.js') => {

	return gulp.src(source).pipe(order([
			'jquery.min.js',
			'priority/**/*.js',
			'common/**/*.js'
		]))
		.pipe(minify(options.minify))
		.on('error', (err) => {jsErrHandler(err)})
		.pipe(concat(filename))
		.pipe(gulp.dest(dest))
		.pipe(browserSync.reload({
			stream: true
		}));
}

const jsProject = ( 
	source 
	, dest
	, filename = 'bundleproject.js') => {



	return gulp.src(source).pipe(babel(options.babel))
		.pipe(uglify(options.uglify))
		.on('error', (err) => {jsErrHandler(err)})
		.pipe(concat(filename))
		.pipe(gulp.dest(dest))
		.pipe(browserSync.reload({
			stream: true
		}));
}

const scss = ( 
	source
	, dest ) => {

	const plugins = [
			autoprefixer() ,
			cssnano({
				zindex: false,
				reduceIdents: false
			})
	];

	return gulp.src(source)
		.pipe(sass().on('error', sass.logError))
		.pipe(sass(options.sass)) // Using gulp-sass
		.pipe(postcss(plugins))
		.pipe(gulp.dest(dest))
		.pipe(browserSync.reload({
			stream: true
		}));
}

const css = (
	source
	, dest 
	, filename = 'bundlecss.css') => {

	return gulp.src(source)
		.pipe(cleanCSS(options.cleancss))
		.pipe(concat(filename))
		.pipe(gulp.dest(dest))
		.pipe(browserSync.reload({
			stream: true
		}));
}



gulp.task('nodemon', function (cb) {
	let started = false;
	return nodemon({
		env: { 'NODE_ENV': 'development' },
		ignore: ['src','public']
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true; 
		}
	});
});
gulp.task('browserSync', function() {
	browserSync.init({
		watch: true,
		proxy: 'localhost:3002/'
	})
});
gulp.task('js-dependency', () => { jsDependency('src/js/dependency/**/*.js','public/js/') });
gulp.task('js-project', () => { jsProject('src/js/project/**/*.js','public/js/') });
gulp.task('scss', () => { scss('src/scss/**/*.scss','public/css/') });
gulp.task('css', () => { css('src/css/**/*.css','public/css/') });

gulp.task('default', [
	'nodemon'
	, 'js-dependency'
	, 'js-project'
	, 'browserSync'
	, 'scss'
	, 'css' ] 
	, function(){
	gulp.watch('src/css/**/*.css', ['css']);
	gulp.watch('src/scss/**/*.scss', ['scss']);
	gulp.watch('src/js/dependency/**/*.js', ['js-dependency']);
	gulp.watch('src/js/project/**/*.js', ['js-project']);
	gulp.watch('views/**/*.pug', browserSync.reload);
});