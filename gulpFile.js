const gulp = require('gulp');
const sass = require('gulp-sass');

const paths = {
  sass: {
    "in": 'assets/sass/app.sass',
    "out": 'public/css'
    // "out": 'build/css'
  }
};

gulp.task('sass', function () {

  gulp.src(paths.sass.in)
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest(paths.sass.out));

});

gulp.task('watch', function () {
  gulp.watch(paths.sass.in, [ 'sass' ]);
});

gulp.task('default', ['sass', 'watch']);
