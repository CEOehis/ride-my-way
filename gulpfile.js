var gulp = require('gulp');
var browserSync = require('browser-sync').create();

// static server
gulp.task('serve', function () {
  browserSync.init({
    server: ['./UI']
  });

  gulp.watch('./UI/**/*.html').on('change', browserSync.reload);
  gulp.watch('./UI/**/*.css').on('change', browserSync.reload);
});

gulp.task('default', ['serve']);