var project = require('../../src');
var gutil = require('gulp-util');
var should = require('should');

describe('Stream compliance', function () {
  it('file should pass through', function (done) {
    var a = 0;
    var file = 'file.js';
    var path = './test/fixture/'+file;

    var fakeFile = new gutil.File({
      path: path,
      cwd: './test/',
      base: './test/fixture/',
      contents: new Buffer('wadup();')
    });

    var stream = project("This is a test");
    stream.on('data', function (newFile) {
      should.exist(newFile);
      should.exist(newFile.path);
      should.exist(newFile.relative);
      should.exist(newFile.contents);
      newFile.path.should.equal(path);
      newFile.relative.should.equal(file);
      ++a;
    });

    stream.once('end', function () {
      a.should.equal(1);
      done();
    });

    stream.write(fakeFile);
    stream.end();
  });
});
