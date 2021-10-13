const _ = require("lodash");
const HID = require("node-hid");
const SerialPort = require("serialport");
const AxpertPort = require("./axpertPort");
const { AxpertQueries } = require("./queries/queries");

const defaultHIDOptions = {
  vid: 0x665,
  pid: 0x5161,
};

class AxpertMonitor extends AxpertPort {
  constructor(options) {
    super(options.timeout);
    this.get = new AxpertQueries(this.request.bind(this));

    if (options.port) {
      this.port = new SerialPort(options.port, {
        baudRate: 2400,
      });
    } else if (options.hid) {
      this.port = new HID.HID(options.hid);
    } else {
      // default to USB using known VendorID and ProductID
      options = _.defaults({}, options, defaultHIDOptions);
      this.port = new HID.HID(options.vid, options.pid);
    }

    this.port.on("data", this.dataHandler.bind(this));
    this.port.on("error", this.errorHandler.bind(this));
  }
}

module.exports = AxpertMonitor;
