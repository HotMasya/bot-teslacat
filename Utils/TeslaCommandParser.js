const { EventEmitter } = require("events");

module.exports = class extends EventEmitter {
  constructor() {
    super();
    this.dataArray = [];
    this.parsingStarted = false;
  }

  Parse() {}
  StartCondition(json) {}
  EndCondition(json) {}
  Read(json) {}
};
