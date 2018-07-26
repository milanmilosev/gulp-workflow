var gulp           = require('gulp');
var browserSync    = require('browser-sync').create();
var cssmin         = require('gulp-cssmin');
var sass           = require('gulp-sass');
var newer          = require('gulp-newer');
var babel          = require('gulp-babel');
var babelMinify    = require("gulp-babel-minify");
var concat         = require('gulp-concat');
var autoprefixer   = require('gulp-autoprefixer');
var reload         = browserSync.reload;
var src = {
  scss  : 'app/src/scss/*.scss',
  jsSrc : 'app/src/js/',
  css   : 'app/css/',
  js    : 'app/js/',
  html  : 'app/*.html',
  img   : 'app/img/**/*.{gif,jpg,png,svg}',
  dist  : 'dist/'
};

gulp.task('serve', ['scss','js'], function() {
  browserSync.init({
    server: "./app"
  });
  gulp.watch(src.scss, ['scss']);
  gulp.watch(src.jsSrc + '**/*.js', ['js']);
  gulp.watch(src.html).on('change', reload);
});

// HTML Processing
gulp.task('html', function(){
  return gulp.src(src.html)
    .pipe(newer(src.html))
    .pipe(gulp.dest(src.dist));
});

// Converting scss to css
gulp.task('scss', function(){
  return gulp.src(src.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(src.css))
    .pipe(reload({stream: true}));
});

// JS
gulp.task('js', function() {
  return gulp.src(src.jsSrc + '**/*.js')
  .pipe(babel())
  .pipe(gulp.dest(src.js))
});

// Move img to dist
gulp.task('distImg', function() {
  return gulp.src(src.img)
  .pipe(gulp.dest('./dist/img/'));
  return gulp.src(src.assets)
  .pipe(gulp.dest('./dist/img/'));
});

// CSS compress / minify 
gulp.task('cssMinify', ['scss'], function(){
  return gulp.src(src.css + '**/*.css')
    .pipe(cssmin())
    .pipe(gulp.dest(src.dist + 'css'));
});

// Compress / minify JS files
gulp.task('jsMinify', function() {
  return gulp.src(src.jsSrc + '**/*.js')
  .pipe(babel())
  .pipe(concat('app.js'))
  .pipe(gulp.dest('./dist/js/'))
  .pipe(babelMinify({
    mangle: {
      keepClassName: true
    }
  }))
  .pipe(gulp.dest('./dist/js/'))
});

// production
gulp.task('prod', ['html', 'cssMinify', 'jsMinify', 'distImg']);

gulp.task('default', ['serve']);