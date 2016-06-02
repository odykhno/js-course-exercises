'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var strip = require('gulp-strip-comments');

var DEST = 'build/';

gulp.task('default', function() {
  return gulp.src('index.js')
    // This will minify and rename to foo.min.js
    .pipe(strip())
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(DEST));
});