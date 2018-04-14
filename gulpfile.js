var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var open = require('gulp-open');
var runSequence = require('run-sequence');
var kss = require('kss');

var kssConfig = {
  "title": "Setup KSS",
  "source": "src/css/",
  "destination": "build/styleguide/",
  "builder": "kss-template/",
  "css": "css/index.css"
  //"homepage": "../kss-template/homepage.md"
};

// kss tasks

var sassFiles = [__dirname + '/src/css/index.scss', __dirname + '/src/css/normalize.css', __dirname + '/node_modules/csstyle/csstyle.scss'],
    cssDest = './build/styleguide/css/';

gulp.task('kss:scss', function(){
  return gulp.src(sassFiles)
    .pipe(sass({
      includePaths: [__dirname + '/node_modules/csstyle/']
    }).on('error', function(error) {
        sass.logError(error);
    })).pipe(gulp.dest(cssDest));
});

gulp.task('kss:watch', function() {
  return gulp.watch([
    'src/css/*',
    'src/css/**/*',
    'src/css/**/**/*'
    ], ['kss:rebuild']);
});

gulp.task('kss:rebuild', function() {
  runSequence('kss:scss', 'kss:build', 'kss:reload');
});

gulp.task('kss:reload', function() {
    gulp.src("./build/styleguide/*.html")
        .pipe(connect.reload());
});

gulp.task('kss:build', function() {
  return kss(kssConfig).then(function(data) {
    //connect.reload();
  });
});

gulp.task('kss:connect', function() {
  connect.server({
    root: ['./build/styleguide'],
    livereload: true,
    port: 8888,
    app: 'google-chrome'
  });
});

gulp.task('kss:open', function(){
  var options = {
    uri: 'http://localhost:8888',
    //app: 'chrome' // windows
    app: 'google-chrome' // linux
  };
  gulp.src('./build/styleguide/index.html')
  .pipe(open(options));
});

gulp.task('kss:copy:deps', function() {
    gulp.src(['./src/fonts/**/*']).pipe(gulp.dest('./build/styleguide/fonts/'));
    gulp.src(['./src/images/**/*']).pipe(gulp.dest('./build/styleguide/images/'));
});

gulp.task('kss', ['kss:copy:deps', 'kss:connect', 'kss:scss', 'kss:build', 'kss:open', 'kss:watch']);
