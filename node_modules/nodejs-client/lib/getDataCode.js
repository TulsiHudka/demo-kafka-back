var formidable = require('formidable');
var fs = require('fs');

exports.code = function(req, callback) {
  var data1 = {};
  var form = new formidable.IncomingForm();
  form.uploadDir = "./";
  form.keepExtensions = true;
  form.type = 'urlencoded';
  form.on('file', function(name, file) {
    fs.unlink(form.uploadDir + file.path, function(err) {
      if (err) console.log(err);
    });
  });
  form.on('field', function(name, field) {
    data1[name] = field;
  });
  form.on('error', function(err) {
    console.log(err);
    next(err);
  });
  form.on('end', function() {
    callback(data1);
  });
  form.parse(req, function(err, fields, files) {
    if (err) console.log(err);
  });
}
