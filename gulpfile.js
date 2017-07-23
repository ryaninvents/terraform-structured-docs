var gulp = require('gulp');
var map = require('through2-map');
var filter = require('through2-filter');

var tfDocParse = require('.');

gulp.task('json.resources', function () {
  return gulp.src('terraform-website/ext/providers/*/website/docs/r/*.html.markdown', {buffer: true})
    .pipe(map.obj(function (file) {
      var jsonFile = file.clone();
      var json;

      jsonFile.path = jsonFile.path.replace('.html.markdown', '.json');

      try {
        json = tfDocParse.default(file.contents.toString());
        jsonFile.contents = new Buffer(JSON.stringify(json, null, 2));
        return jsonFile;
      } catch (error) {
        jsonFile.contents = new Buffer(JSON.stringify({error: true, message: error.toString()}));
        return jsonFile;
      }
    }))
    .pipe(gulp.dest('lib_data'));
});
