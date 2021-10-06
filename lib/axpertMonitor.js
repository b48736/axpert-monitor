const AxpertUSB = require("./axpertUSB");
const { AxpertQueries } = require("./queries/queries");

class AxpertMonitor extends AxpertUSB {
  constructor(...args) {
    super(...args);
    this.get = new AxpertQueries(this.request.bind(this));
  }
}

module.exports = AxpertMonitor;
