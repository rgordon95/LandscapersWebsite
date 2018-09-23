'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    rev = require('gulp-rev'),
    cleanCss = require('gulp-clean-css'),
    flatmap = require('gulp-flatmap'),
    htmlmin = require('gulp-htmlmin'),
    browserSync = require('browser-sync');


    gulp.task('sass', function () {
  return gulp.src('./css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./css/*.scss', ['sass']);
});

gulp.task('browser-sync', function () {
   var files = [
      './*.html',
      './assets/css/*.css',
      './assets/img/*.{png,jpg,gif}',
      './assets/js/*.js'
   ];

   browserSync.init(files, {
      server: {
         baseDir: "./"
      }
   });

});

// Default task
gulp.task('default', ['browser-sync'], function() {
    gulp.start('sass:watch');
});

// Clean
gulp.task('clean', function() {
    return del(['dist']);
});

gulp.task('copyfonts', function() {
   gulp.src('./assets/fonts/**/*.{ttf,woff,eof,svg}*')
   .pipe(gulp.dest('./dist/assets/fonts'));
});

// Images
gulp.task('imagemin', function() {
  return gulp.src('./assets/img/*.{png,jpg,gif}')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/assets/img'));
});


gulp.task('usemincss', function() {
  return gulp.src('./assets/css/styles.css')
  .pipe(flatmap(function(stream, file){
      return stream
        .pipe(usemin({
            css: [ rev() ],
            inlinecss: [ cleanCss(), 'concat' ]
        }))
    }))
    .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('usemin', function() {
  return gulp.src('./*.html')
  .pipe(flatmap(function(stream, file){
      return stream
        .pipe(usemin({
            css: [ rev() ],
            html: [ function() { return htmlmin({ collapseWhitespace: true })} ],
            js: [ uglify(), rev() ],
            inlinejs: [ uglify() ],
            inlinecss: [ cleanCss(), 'concat' ]
        }))
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('build',['clean'], function() {
    gulp.start('copyfonts','imagemin','usemin', 'usemincss');
});
