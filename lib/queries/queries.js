const QPI = require("./QPI");
const QVFW = require("./QVFW");
const QPIRI = require("./QPIRI");
const QFLAG = require("./QFLAG");
const QPIGS = require("./QPIGS");
const QMOD = require("./QMOD");
const QPIWS = require("./QPIWS");

const queryParsers = {
  QPIRI,
  QFLAG,
  QVFW,
  QPI,
  QPIGS,
  QMOD,
  QPIWS,
};

class AxpertQueries {
  constructor(request) {
    this.request = request;
  }

  async sendAndParse(query) {
    const rawResponse = await this.request(query);
    if (queryParsers[query]) {
      return queryParsers[query](rawResponse);
    }
    return rawResponse;
  }

  protocolID() {
    return this.sendAndParse("QPI");
  }

  serialNumber() {
    return this.sendAndParse("QID");
  }

  firmwareVersion() {
    return this.sendAndParse("QVFW");
  }

  deviceRating() {
    return this.sendAndParse("QPIRI");
  }

  statusFlags() {
    return this.sendAndParse("QFLAG");
  }

  generalStatus() {
    return this.sendAndParse("QPIGS");
  }

  mode() {
    return this.sendAndParse("QMOD");
  }

  warningStatus() {
    return this.sendAndParse("QPIWS");
  }
}

module.exports = { AxpertQueries, queryParsers };
