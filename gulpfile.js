var gulp = require('gulp')
var browserify = require ('gulp-browserfy');

gulp.task ('browserify', function() {
  return gulp.
    src('./app.js').
    pipe(browserify()).
    pipe(gulp.dest('./bin'));
});

gulp.task('watch', function() {
  gulp.watch(['./*.js'], ['browserify']);
})