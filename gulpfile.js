const autoprefixer = require('gulp-autoprefixer');
const babelify = require('babelify');
const browserify = require('browserify');
const browserSync = require('browser-sync');
const buffer = require('vinyl-buffer');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const stripCssComments = require('gulp-strip-css-comments');
const uglify = require('gulp-uglify');

/* Config */
const publicPath = 'ext';
const paths = {
  style: {
    src: 'src/options/scss/options.scss',
    watch: 'src/options/scss/**/*.scss',
    dest: `${publicPath}/options/build`
  },
  scripts: [
    {
      src: 'src/content/main.js',
      outputName: 'content.js',
      watch: 'src/content/**/*.js',
      dest: `${publicPath}/build`
    },
    {
      src: 'src/bg/main.js',
      outputName: 'bg.js',
      watch: 'src/bg/**/*.js',
      dest: `${publicPath}/build`
    },
    {
      src: 'src/options/main.js',
      outputName: 'options.js',
      watch: 'src/options/**/*.js',
      dest: `${publicPath}/options/build`
    }
  ]
};

/* Set environment variables */
process.env.NODE_PATH = 'src';

/* Helper tasks */

gulp.task('build', () => { // Basic build development version
  process.env.NODE_ENV = 'development';
  gulp.start('styles', 'scripts');
});

gulp.task('build-production', ['clean'], () => { // Production version deletes previous stuff, minifies, strips comments
  process.env.NODE_ENV = 'production';
  gulp.start('styles-production');
  gulp.start('scripts-production');
});

gulp.task('default', ['build'], () => { // Default builds immediately and then starts watching
  gulp.start('watch');
});

gulp.task('watch', () => { // Watch for changes
  paths.scripts.forEach(script => gulp.watch(script.watch, ['scripts']));
  gulp.watch(paths.style.watch, ['styles']);
  gulp.watch('src/shared/**/*.js', ['scripts']);
  gulp.watch([`${publicPath}/**/*`]).on('change', browserSync.reload);
});

/* Development tasks */

gulp.task('scripts', () => {
  paths.scripts.forEach(script => {
    const b = browserify({
      entries: script.src,
      debug: true
    }).transform(babelify, {
      presets: ['es2015']
    });

    return b.bundle()
      .on('error', function errHandler(err) {
        gutil.log(err);
        this.emit('end');
      })
      .pipe(source(script.outputName))
      .pipe(buffer())
      .pipe(sourcemaps.init({
        loadMaps: true
      }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(script.dest));
  });
});

gulp.task('styles', () => gulp.src(paths.style.src)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer('last 3 versions'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.style.dest)));

/* Production tasks */

gulp.task('scripts-production', () => {
  paths.scripts.forEach(script => {
    const b = browserify({
      entries: script.src,
      debug: false
    }).transform(babelify, {
      presets: ['es2015']
    });

    return b.bundle()
      .on('error', function errHandler(err) {
        gutil.log(err);
        this.emit('end');
      })
      .pipe(source(script.outputName))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(gulp.dest(script.dest));
  });
});

gulp.task('styles-production', () => gulp.src(paths.style.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(stripCssComments({
      all: true
    }))
    .pipe(autoprefixer('last 3 versions'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.style.dest)));

gulp.task('clean', () => del([
  `${publicPath}/build/**/*`,
  `${publicPath}/options/build/**/*`
]));
