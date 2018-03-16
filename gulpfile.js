/*
 * gulpfile.js
 */

var gulp = require('gulp');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

gulp.task('default', function() {
    // Autoprefixer
    var plugins = [
        autoprefixer({browsers: ['last 1 version']})
    ];
    return gulp.src('./public/css/main.css')
        .pipe(postcss(plugins))
        .pipe(gulp.dest('./public/css'));
});