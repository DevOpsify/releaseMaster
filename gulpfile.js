var gulp = require('gulp')
var browserify = require('browserify');
var source     = require('vinyl-source-stream');


gulp.task('browserify', function() {
    return browserify({ entries: ["./public/javascripts/index.js"] })
        .bundle()
        .pipe(source('index.js'))
        .pipe(gulp.dest('./public/javascripts/bin/'))
});

gulp.task('watch', function() {
  gulp.watch(['./public/javascripts/*.js'], ['browserify']);
});