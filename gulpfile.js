var gulp = require('gulp');
var map = require('through2-map');
var filter = require('through2-filter');

var tfDocParse = require('.');

var totalResources = 0;
var successfulResources = 0;

gulp.task('json.resources', function () {
  return gulp.src('terraform-website/ext/providers/*/website/docs/r/*.html.markdown', {buffer: true})
    .pipe(map.obj(function (file) {
      var jsonFile = file.clone();
      var json;

      jsonFile.path = jsonFile.path
        .replace('website/docs/r/', '')
        .replace('.html.markdown', '.json');

      totalResources++;

      try {
        json = tfDocParse.default(file.contents.toString());
        jsonFile.contents = new Buffer(JSON.stringify(json, null, 2));
        successfulResources++;
        return jsonFile;
      } catch (error) {
        jsonFile.contents = new Buffer(JSON.stringify({error: true, message: error.toString()}));
        jsonFile.error = error.message;
        return jsonFile;
      }
    }))
    .pipe(filter.obj(function (file) {
      if (file.error) {
        console.log('Could not parse ' + file.path);
        console.log(file.error);
        return false;
      }
      return true;
    }))
    .pipe(gulp.dest('lib_data'));
});

gulp.task('data', ['json.resources'], function () {
  console.log('Successfully processed ' + successfulResources + '/' + totalResources + ' resources');
});
