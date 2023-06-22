var fs = require("fs");

global.allClientSenderData = [];

function store(data, id) {

  try {
    global.allClientSenderData[id] = data;
  } catch(e) {
    console.log(e);
  }
}


function retrieve(id) {
  try {
    return global.allClientSenderData[id];
  } catch(e) {
    console.log(e);
    return;

  }
}


exports.store = store;

exports.retrieve = retrieve;
