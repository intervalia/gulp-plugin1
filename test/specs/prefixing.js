var gutil = require('gulp-util');
var project = require('../../src');

describe('prefixing', function () {
  it('should prefix two files', function (done) {
    var a = 0;
    var buf1 = "buffer1";
    var buf2 = "testing";
    var buf;
    var prefix = "0123456789";

    var fakeFile = new gutil.File({
      path: './test/fixture/file.js',
      cwd: './test/',
      base: './test/fixture/',
      contents: new Buffer(buf1)
    });

    var fakeFile2 = new gutil.File({
      path: './test/fixture/file2.js',
      cwd: './test/',
      base: './test/fixture/',
      contents: new Buffer(buf2)
    });

    var stream = project(prefix);

    stream.on('data', function (newFile) {
      var temp = newFile._contents.toString();
      temp.should.equal(prefix+buf);
      //console.log(JSON.stringify(newFile));
      //console.log(temp);
      ++a;
    });

    stream.once('end', function () {
      a.should.equal(2);
      done();
    });

    buf = buf1;
    stream.write(fakeFile);
    buf = buf2;
    stream.write(fakeFile2);
    stream.end();
  });
});
