'use strict'

//
// Here will be block of required modules
//You need to install it and be able to understand

const gulp = require('gulp'),// npm install gulp -g, npm install gulp --save-dev
      jade = require('gulp-jade'),
      sass = require('gulp-sass'),
      debug = require('gulp-debug'), // not for all project
      gulpIf = require('gulp-if'),
      sourcemaps = require('gulp-sourcemaps'),
      del = require('del'),
      react = require('gulp-react'),
      minifyCss = require('gulp-minify-css'),
      uglifyJs = require('gulp-uglifyjs'),
      imageMin = require('gulp-imagemin');
const browserSync = require('browser-sync').create(); // need to install it with --save-dev



// Variables and objects which we will use in config
const Development = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';
let PATHS = {
    script: 'source/reactScripts/*.{jsx,js}',
    css: 'source/styles/*.{sass,scss}',
    scriptPub: 'public/'
};


// task for images optimiz
gulp.task('imageOptimisation', function() {
    gulp.src('source/assets/*.{jpg,png,svg}')
        .pipe(imageMin())
        .pipe(gulp.dest('public/assets'));
});


// task for building html from jade/pug
gulp.task('marking', function () {
    let LOCALS = {};

    gulp.src('source/marking/**/*.jade')
        .pipe(gulpIf(Development, sourcemaps.init()))
        .pipe(jade({
            locals: LOCALS
        }))
        .pipe(gulpIf(Development, sourcemaps.write()))
        .pipe(gulp.dest('public'));
});


// task for building css from sass/scss
gulp.task('styles', function () {
    return gulp.src('source/styles/**/*.{sass,scss}')
        .pipe(gulpIf(Development, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpIf(Development, sourcemaps.write()))
        .pipe(gulp.dest('public/styles'));
});


// task for building native js from react jsx
gulp.task('build-react', function () {
    return gulp.src('source/reactScripts/**/*.{jsx,js}')
        .pipe(sourcemaps.init())
        .pipe(react())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/js'));
});


// task for compressing final css file
gulp.task('minifyCss', function() {
    return gulp.src('public/styles/main.css')
                .pipe(minifyCss())
                .pipe(gulp.dest('public/styles')); 
});



// task for compressing final js file
gulp.task('compress', function() {
    gulp.src('public/js/**/*.js')
        .pipe(uglifyJs())
        .pipe(gulp.dest('public/js'));
});

// delete public directory
gulp.task('clean', function() {
    return del('public');
});

gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: PATHS.scriptPub,
            index: 'main.html'
        }
    });
});


gulp.task('watcher', function(){
    gulp.watch('source/marking/**/*.{jade,pug}',['marking'])
    gulp.watch('source/styles/**/*.{sass,scss}',['styles','minifyCss']);
    gulp.watch('source/reactScripts/**/*.{jsx,js}',['build-react']);
    gulp.watch('source/assets/**/*.{jpeg,png,svg}',['imageOptimisation']);
});

// Here will be main tasks for gulp
// Here will be to ways of build: production, working

gulp.task('default',['watcher','imageOptimisation','marking','styles','build-react','minifyCss','server']);

