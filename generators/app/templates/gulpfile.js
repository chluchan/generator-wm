var gulp = require('gulp');
    webserver = require('gulp-webserver');

var dependenciesLocation = 'node_modules';
var bootstrapLocation = dependenciesLocation + '/bootstrap/dist';

// run init tasks
gulp.task('build', ['dependencies', 'dependencies-fonts', 'js', 'html', 'css']);
gulp.task('default', ['build']);

gulp.task('dependencies', function () {
  return gulp.src([
    bootstrapLocation + '/js/bootstrap.min.js',
    bootstrapLocation + '/css/bootstrap.min.css',
    bootstrapLocation + '/css/bootstrap.min.css.map',
    bootstrapLocation + '/css/bootstrap-theme.min.css',
    bootstrapLocation + '/css/bootstrap-theme.min.css.map',
    dependenciesLocation + '/jquery/dist/jquery.min.js'
  ]).pipe(gulp.dest('build/lib'));
});

gulp.task('dependencies-fonts', function() {
  return gulp.src([
    bootstrapLocation + '/fonts/glyphicons-halflings-regular.eot',
    bootstrapLocation + '/fonts/glyphicons-halflings-regular.svg',
    bootstrapLocation + '/fonts/glyphicons-halflings-regular.ttf',
    bootstrapLocation + '/glyphicons-halflings-regular.woff',
    bootstrapLocation + '/glyphicons-halflings-regular.woff2'
  ]).pipe(gulp.dest('build/fonts'));
});

gulp.task('js', function () {
  return gulp.src('src/**/*.js')
    .pipe(gulp.dest('build'));
});

// move html
gulp.task('html', function () {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('build'))
});

// move css
gulp.task('css', function () {
  return gulp.src('src/**/*.css')
    .pipe(gulp.dest('build'))
});

// serve the build dir
gulp.task('serve', function () {
  gulp.src('build')
    .pipe(webserver({
      open: true
    }));
});
