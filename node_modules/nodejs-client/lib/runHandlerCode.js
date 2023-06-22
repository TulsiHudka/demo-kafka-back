var data = require("./data");



exports.code = function(req, res, data1, id) {

  var err = false;

  var handlers = data.grab("handlers", id);
  if (!handlers[data1.name]) {

    err = "ERROR: No such handler as " + data1.name;

    console.log(err);
    return;

  }

    eval('(' + handlers[data1.name] + ')') (JSON.parse(data1.data), function(d) {

    res.writeHead(200, {'Content-Type': 'text/plain'});

    res.write(JSON.stringify(d));

    res.end();

  }, err);
}
;