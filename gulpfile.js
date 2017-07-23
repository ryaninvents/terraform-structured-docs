var gulp = require('gulp');
var map = require('through2-map');

var tfDocParse = require('.');

gulp.task('json.resources', function () {
  return gulp.src('terraform-website/ext/providers/*/website/docs/r/*.html.markdown', {buffer: true})
    .pipe(map.obj(function (file) {
      var jsonFile = file.clone();

      var json = tfDocParse.default(file.contents.toString());
      jsonFile.contents = new Buffer(JSON.stringify(json, null, 2));
      jsonFile.extname = '.json';

      return jsonFile;
    }))
    .pipe(gulp.dest('lib_data'));
});
