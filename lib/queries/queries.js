const { getProtocolID, QPI } = require("./protocolID");
const getDeviceSN = require("./deviceSN");
const { getFirmwareVersion, QVFW } = require("./firmwareVersion");
const { getDeviceRating, QPIRI } = require("./deviceRating");
const { getStatusFlags, QFLAG } = require("./statusFlags");

class AxpertQueries {
  constructor(request) {
    this.request = request;
  }

  protocolID() {
    return getProtocolID(this.request);
  }

  serialNumber() {
    return getDeviceSN(this.request);
  }

  firmwareVersion() {
    return getFirmwareVersion(this.request);
  }

  deviceRating() {
    return getDeviceRating(this.request);
  }

  statusFlags() {
    return getStatusFlags(this.request);
  }
}

const queryParsers = {
  QPIRI,
  QFLAG,
  QVFW,
  QPI,
};

module.exports = { AxpertQueries, queryParsers };
