/* Libraries */
const babel = require('gulp-babel'),
      browserSync = require('browser-sync').create(),
      del = require('del'),
      gulp = require('gulp'),
      imagemin = require('gulp-imagemin'),
      sass = require ('gulp-sass'),
      sourcemaps = require('gulp-sourcemaps'),
      webpackStream = require('webpack-stream'),
      webpack = require('webpack'),
      webpackConfig = require('./webpack.config');

/* Path information */
const dev = './src',
      build = './build',
      PATHS = {
        'devJsFiles': `${dev}/js/**/*.js`,
        'devJsEntry': `${dev}/js/main.js`,
        'devScssEntry': `${dev}/scss/style.scss`,
        'devScssFiles': `${dev}/scss/**/*.scss`,
        'devHtmlFiles': `${dev}/html/**/*.html`,
        'devFontFiles': `${dev}/fonts/**/*`,
        'devSoundFiles': `${dev}/sounds/**/*`,
        'devImageFiles': `${dev}/img/**/*`,
        'buildScssDirectory': `${build}/css/`,
        'buildJsDirectory': `${build}/js/`,
        'buildHtmlDirectory': build,
        'buildFontsFiles': `${build}/fonts`,
        'buildSoundFiles': `${build}/sounds`,
        'buildImagesFiles': `${build}/img`
      };

/* Gulp tasks */
gulp.task('default', ['build', 'watch', 'serve'])

gulp.task('build', ['scss', 'js', 'html', 'fonts', 'images', 'sounds'])

gulp.task('watch', () => {
  gulp.watch(PATHS.devScssFiles, ['scss'])
  gulp.watch(PATHS.devJsFiles, ['js:watch'])
  gulp.watch(PATHS.devHtmlFiles, ['html:watch'])
})

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: './build/',
      proxie: 'localhost'
    }
  })
})

gulp.task('scss', () => {
  return gulp.src(PATHS.devScssEntry)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(PATHS.buildScssDirectory))
    .pipe(browserSync.stream())
})

gulp.task('js', () => {
  return gulp.src(PATHS.devJsEntry)
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(PATHS.buildJsDirectory))
})

gulp.task('js:watch', ['js'], (done) => {
  browserSync.reload()
  done()
})

gulp.task('html', () => {
  gulp.src(PATHS.devHtmlFiles)
    .pipe(gulp.dest(PATHS.buildHtmlDirectory))
})

gulp.task('html:watch', ['html'], (done) => {
  browserSync.reload()
  done()
})

gulp.task('fonts', () => {
  gulp.src(PATHS.devFontFiles)
    .pipe(gulp.dest(PATHS.buildFontsFiles))
})

gulp.task('images', () => {
  gulp.src(PATHS.devImageFiles)
    .pipe(imagemin())
    .pipe(gulp.dest(PATHS.buildImagesFiles))
})

gulp.task('sounds', () => {
  gulp.src(PATHS.devSoundFiles)
    .pipe(gulp.dest(PATHS.buildSoundFiles));
});

gulp.task('clean', () => {
  return del([
    `${build}/**/*`
  ])
})