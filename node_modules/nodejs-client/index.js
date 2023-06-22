var currentID = 0;

exports.Client = function() {
  var serverCode = require("./lib/HTTPServerCode");
  var id = currentID++;

  var httpserver = require('http').createServer(function (req, res) {
    serverCode.code(req, res, id);
  });
  var onCode = require("./lib/onCode");

  var on = onCode.code;
  var dataGet = require("./lib/data");

  function ping(data) {
    return data;
  }

  dataGet.set("handlers", {ping: ping.toString()}, id);

  dataGet.set("connectors", {}, id);

  function listen(port, hostname, backlog, callback) {
    httpserver.listen(port, hostname, backlog, callback);
  }

  this.listen = listen;
  this.on = function(event, name, func) {
    on(event, name, func, id);
  };
  this.getId = function() {
    return id;
  };
};