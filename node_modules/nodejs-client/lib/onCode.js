var data = require("./data");


exports.code = function(event, name, func, id) {
  func = func || name;

  var hasName = true;

  if (func == name) {

    hasName = false;

  }

  if (hasName && event == 'request') {

    if (name == "ping") { return; }

    var handlers = data.grab("handlers", id);
    handlers[name] = func.toString();

    data.set("handlers", handlers, id);

  } else if (event == 'connect') {

    var connectors = data.grab("connectors", id);
    if (hasName) {

      connectors[name] = func.toString();

    } else {

      connectors.general = func.toString();

    }

    data.set("connectors", connectors, id);

  }
}
;
