var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    <% if (reloader === 'browsersync') { %>browserSync = require('browser-sync').create(),<% } else { %>server = require('gulp-server-livereload'),<% } %>
    concat = require('gulp-concat'),
    <% if (styles === 'sass') { %>sass = require('gulp-sass')<% } else { %>less = require('gulp-less')<% } %>;

var dependenciesLocation = <% if (packageManager == 'node') { %>'node_modules'<% } else { %>'bower_components'<% } %>;
var bootstrapLocation = dependenciesLocation + '/bootstrap/dist';

// run init tasks
gulp.task('build', ['dependencies', 'dependencies-fonts', 'js', 'html', 'styles']);
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

<% if (styles === 'sass') { %>
// Compile sass into CSS & auto-inject into browsers
gulp.task('styles', function () {
    return gulp.src("src/**/*.scss")
        .pipe(sass({
          style: 'compressed',
          includePaths: [
            dependenciesLocation + '/bootstrap-sass/assets/stylesheets',
            dependenciesLocation + '/bootstrap-material-design/sass'
          ]
        }))
        .pipe(concat('style.css'))
        .pipe(gulp.dest("build"))<% if (reloader == 'browsersync') { %>
        .pipe(browserSync.stream());<% } else { %>;<% } %>
});
<% } else { %>
// Compile less into CSS & auto-inject into browsers
gulp.task('styles', function () {
  return gulp.src('./src/**/*.less')
    .pipe(less({
      paths: [
        dependenciesLocation + '/bootstrap/less',
        dependenciesLocation + '/bootstrap-material-design/less'
      ]
    }))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('build'))<% if (reloader == 'browsersync') { %>
    .pipe(browserSync.stream());<% } else { %>;<% } %>
});
<% } %>

// Static Server + watching scss/html files
gulp.task('serve', ['build'], function () { <% if (reloader == 'browsersync') { %>
  browserSync.init({
      server: "./build"
  });
  <% } %>
  <% if (styles === 'sass') { %>gulp.watch("src/**/*.scss", ['sass']); <% } %>
  gulp.watch("src/**/*.js", ['js']);
  gulp.watch("src/**/*.html", ['html']);
  <% if (reloader == 'browsersync') { %>gulp.watch("build/**/*").on('change', browserSync.reload);<% } else { %>
  gulp.src('build').pipe(server({
    livereload: true,
    directoryListing: false,
    open: true
  }));<% } %>
});
