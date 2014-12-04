var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var Mocha = require('mocha');
var components = require('./src/index.js');
var oldTemplatePlugin = require("./plugins/oldTemplates");

var assemblyPath = "/Users/collinsmg/projects/tree/frontier-tree/assets/js/modules/**/assembly.json";
    //assemblyPath = "testdata/**/assembly.json";

gulp.task('lint', function () {
  return gulp.src([
    'src/**/*',
    'test/**/*',
    '!test/fixtures/**/*',
    '*.js'
  ])
  .pipe(jshint({"esnext": true}))
  .pipe(jshint.reporter('default', { verbose: true }))
  .pipe(jshint.reporter('fail'));
});

gulp.task('build', function() {
  components.addPlugin( components.pluginType.INLINE, oldTemplatePlugin );

  return(
    gulp.src(assemblyPath)
        .pipe(components.assemble({
          "defaultLocale": 'en',
          "minTemplateWS": true,
          "supportTransKeys": false,
          "useExternalLib": true
        }))
        .pipe(gulp.dest('./prod'))
        .pipe(uglify())
        .pipe(rename(function (path) {
          path.basename += "-min";
          }))
        .pipe(gulp.dest('./prod'))
  );
});

gulp.task('test', ['lint'], function (done) {
  var m = new Mocha();
  m.addFile(__dirname + '/test/specs/index.js');
  m.run().on('end', done);
});
