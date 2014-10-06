// through2 is a thin wrapper around node transform streams
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

// consts
const PLUGIN_NAME = 'gulp-prefixer';

function prefixStream(prefixText) {
  var stream = through();
  stream.write(prefixText);
  return stream;
}

// plugin level function (dealing with files)
function gulpPrefixer(prefixText) {
  //console.log(prefixText);
  if (!prefixText) {
    throw new PluginError(PLUGIN_NAME, 'Missing prefix text!');
  }

  prefixText = new Buffer(prefixText); // allocate ahead of time

  // creating a stream through which each file will pass
  var stream = through.obj(function(file, enc, cb) {
    //console.log(JSON.stringify(file));
    if (file.isNull()) {
      //console.log("isNull");
      // do nothing if no contents
    }

    if (file.isBuffer()) {
      //console.log("isBuffer");
      file.contents = Buffer.concat([prefixText, file.contents]);
    }

    if (file.isStream()) {
      //console.log("isStream");
      file.contents = file.contents.pipe(prefixStream(prefixText));
    }

    this.push(file);
    //console.log(JSON.stringify(file));
    return cb();
  });

  // returning the file stream
  return stream;
}

// exporting the plugin main function
module.exports = gulpPrefixer;
