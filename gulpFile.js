var gulp          = require('gulp');
var sass          = require('gulp-ruby-sass');

gulp.task('sass', function () {
  sass('build/sass/*.scss')
  .pipe(gulp.dest('views/assets/css'));
});

gulp.task('watch', function () {
  gulp.watch('build/sass/*.scss', ['sass']);
});

gulp.task('default', ['sass', 'watch']);
