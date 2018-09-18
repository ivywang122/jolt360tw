var gulp = require('gulp');
var webserver = require('gulp-webserver'),
  minifyCSS = require('gulp-minify-css'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  rename = require("gulp-rename"),
  jshint = require('gulp-jshint'),
  gulpSass = require("gulp-sass"),
  browserSync = require('browser-sync').create(),
  replace = require('gulp-replace-task'),
  wait = require('gulp-wait');

// webserver
gulp.task('webserver', function () {
  gulp.src('./')
    .pipe(webserver({
      port: 8000,
      livereload: true,
      directoryListing: false,
      open: false,
      fallback: 'index.html'
    }));
});

// watch 監看
gulp.task('watch', function () {
  gulp.watch('./js/*.js', ['script']);
  gulp.watch('./scss/**/*.scss', ['styles']);
  gulp.watch('./**/*.html', ['replace']);
});

// uglify js最小化
gulp.task('script', function () {
  gulp.src('./js/*.js')        // 指定要處理的原始 JavaScript 檔案目錄
    .pipe(uglify())            // 將 JavaScript 做最小化
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./build/js'));  // 指定最小化後的 JavaScript 檔案目錄
});

// js 壓縮合併
gulp.task('minifyjs', function () {
  return gulp.src('./js/*.js')
    .pipe(concat('main.js')) // 合併所有 js 到main.js
    .pipe(gulp.dest('./build/js')) // 輸出位置
    .pipe(rename({ // 重新命名
      suffix: '.min'
    }))
    .pipe(uglify()) // 壓縮
    .pipe(gulp.dest('./build/js')); //输出
});

// jshint JS代碼檢測
gulp.task('jshint', function () {
  return gulp.src('./js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// sass
gulp.task('styles', function () {
  gulp.src('./scss/**/*.scss')    // 指定要處理的 Scss 檔案目錄
    .pipe(wait(500))
    .pipe(gulpSass({              // 編譯 Scss
      outputStyle: 'compressed'
    }))
    .pipe(gulp.dest('./css'));  // 指定編譯後的 css 檔案目錄
});

// browserSync
gulp.task('serve', ['styles'], function () {
  browserSync.init({
    proxy: "localhost:8000"   // hostname
  });
});

// replace Task 用來拆 HTML Componets用
var fs = require('fs');
gulp.task('replace', function () {
  gulp.src('./app/index.html')
    .pipe(replace({
      patterns: [
        {
          match: 'Navbar',
          replacement: fs.readFileSync('./app/includes/Navbar.html', 'utf8')
        },
        {
          match: 'MainInfo',
          replacement: fs.readFileSync('./app/includes/MainInfo.html', 'utf8')
        },
        {
          match: 'Slick',
          replacement: fs.readFileSync('./app/includes/Slick.html', 'utf8')
        },
        {
          match: 'Support',
          replacement: fs.readFileSync('./app/includes/Support.html', 'utf8')
        },
        {
          match: 'Footer',
          replacement: fs.readFileSync('./app/includes/Footer.html', 'utf8')
        }
      
      ]
    }))
    .pipe(gulp.dest('./'));
});


// css 壓縮
gulp.task('minifycss', function () {
  return gulp.src('./css/*.css')
    .pipe(rename({ // 重新命名
      suffix: '.min'
    }))
    .pipe(gulp.dest('./build/css')); //输出
});

gulp.task('default', ['watch', 'serve', 'webserver', 'jshint'], function () {
  gulp.start('minifycss');
  gulp.start('script');
});