var storage = require("./storage");


function getDataFile(id) {

  return storage.retrieve(id);

}


function setDataFile(file, id) {

  storage.store(file, id);

}


function grab(name, id) {

  var data = getDataFile(id);
  if (data[name]) {
    return data[name];
  }
  return;
}


function set(name, data, id) {
  var d = getDataFile(id) || {};

  d[name] = data;

  setDataFile(d, id);

}


exports.grab = grab;

exports.set = set;
