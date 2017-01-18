const gulp = require('gulp');
const sass = require('gulp-sass');
const stripCssComments = require('gulp-strip-css-comments');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const gutil = require('gulp-util');

/* Config */
const publicPath = 'ext';
const paths = {
  style: {
    src: 'src/scss/style.scss',
    watch: 'src/scss/**/*.scss',
    dest: `${publicPath}/options`
  },
  scripts: [
    {
      src: 'src/scripts/content.js',
      outputName: 'content.js',
      watch: 'src/scripts/**/*.js',
      dest: `${publicPath}/js`
    },
    {
      src: 'src/optionsScripts/options.js',
      outputName: 'options.js',
      watch: 'src/optionsScripts/**/*.js',
      dest: `${publicPath}/options`
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

gulp.task('build-production', ['styles-production', 'scripts-production'], () => { // Production version deletes previous stuff, minifies, strips comments
  process.env.NODE_ENV = 'production';
});

gulp.task('default', ['build'], () => { // Default builds immediately and then starts watching
  gulp.start('serve');
});

gulp.task('serve', () => { // Watch for changes and browsersync

  browserSync.init({
    server: {
      baseDir: `${publicPath}/options`
    },
    port: 8787,
    notify: false
  });

  gulp.watch(paths.style.watch, ['styles']);
  paths.scripts.forEach(script => gulp.watch(script.watch, ['scripts']));

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
      .pipe(source('main.js'))
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
