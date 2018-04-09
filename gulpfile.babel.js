'use strict';

import gulp from 'gulp';
import del from 'del';
import less from 'gulp-less';
import path from 'path';
import useref from 'gulp-useref';
import gulpIf from 'gulp-if';
import cssnano from 'gulp-cssnano';
import runSequence from 'run-sequence';
import htmlmin from 'gulp-htmlmin';

var browserSync = require('browser-sync').create();

gulp.task('clean', () => {
  return del(['docs']);
});

gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
});

gulp.task('less', () => {
  return gulp.src('less/site.less')
    .pipe(less({paths: [path.join(__dirname, 'less', 'includes')]}))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('useref', () => {
  return gulp.src('*.html')
    .pipe(useref())
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest('docs'));
});

gulp.task('copy', () => {
  gulp.src('css/**/*.css', {dot: true}).pipe(gulp.dest('docs/css'));
  gulp.src('fonts/**/*.*', {dot: true}).pipe(gulp.dest('docs/fonts'));
  gulp.src('img/**/*.*', {dot: true}).pipe(gulp.dest('docs/img'));
  gulp.src('js/**/*.*', {dot: true}).pipe(gulp.dest('docs/js'));
});

gulp.task('watch', () => {
  gulp.watch('less/site.less', ['less']);
  gulp.watch('*.html', browserSync.reload);
  gulp.watch('js/*.js', browserSync.reload);
});

gulp.task('build', () => {
  runSequence(['clean', 'useref', 'copy']);
});

gulp.task('default', () => {
  runSequence(['less', 'browser-sync', 'watch']);
});
