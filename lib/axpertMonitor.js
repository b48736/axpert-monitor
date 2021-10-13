const AxpertUSB = require("./axpertUSB");
const AxpertTTY = require("./axpertTTY");
const { AxpertQueries } = require("./queries/queries");

class AxpertMonitor extends AxpertTTY {
  constructor(...args) {
    super(...args);
    this.get = new AxpertQueries(this.request.bind(this));
  }
}

module.exports = AxpertMonitor;
