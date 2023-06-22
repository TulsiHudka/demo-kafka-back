var url = require("url");

var data = require("./data");
var runHandlersCode = require("./runHandlerCode");

var getDataCode = require("./getDataCode").code;
var runHandlers = runHandlersCode.code;


var getData = getDataCode.code;



exports.code = function(req, res, id) {

  var q = url.parse(req.url, true);

  var path = q.pathname;

  if (path == "/client/request/server/54193") {

    getData(req, function (d) {

      runHandlers(req, res, d, id);

    });

    return;

  }


  var connectors = data.grab("connectors", id);
  if (!connectors[path]) {

    path = "general";

  }

  if (connectors[path]) {

    eval('(' + connectors[path] + ')')(req, res, function(data) {

      data.header = data.header || {};

      data.header['Content-Type'] = data.type;

      res.writeHead(data.code, data.header);

      res.write(data.data, 'binary');

      return res.end();

    });

  }
}
