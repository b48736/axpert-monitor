const HID = require("node-hid");
const async = require("async");
const parseResp = require("./messageParser");
const getCRC = require("./crc.js");

class AxpertMonitor {
  constructor(vendorID = 1637, productID = 20833, defaultTimeout = 30000) {
    this.respBuffer = Buffer.alloc(0);
    this.defaultTimeout = defaultTimeout;
    this.hid = new HID.HID(vendorID, productID);
    this.requestQ = async.queue(this.processRequestQ.bind(this), 1);
    this.activeRequest = null;

    this.hid.on("data", this.dataHandler.bind(this));
    this.hid.on("error", this.errorHandler.bind(this));
  }

  dataHandler(data) {
    this.respBuffer = Buffer.concat([this.respBuffer, data]);
    this.checkComplete();
  }

  errorHandler(err) {
    this.reject(err);
    this.respBuffer = Buffer.alloc(0);
  }

  checkComplete() {
    try {
      const message = parseResp(this.respBuffer);

      this.resolve(message);
    } catch (err) {
      if (err.message.includes("CRC missmatch")) {
        this.reject(err);
        return;
      }

      if (err.message === `Message start not found`) {
        this.respBuffer = Buffer.alloc(0);
        return;
      }

      if (err.message.includes("Message too long")) {
        this.respBuffer = this.respBuffer.slice(1);
        return;
      }
    }
  }

  processRequestQ({ command, resolve, reject, options = {} }, next) {
    function resolveAndNext(data) {
      resolve(data);
      this.activeRequest = null;
      next();
    }

    function rejectAndNext(err) {
      reject(err);
      this.activeRequest = null;
      next();
    }

    this.activeRequest = {
      command,
      resolve: resolveAndNext.bind(this),
      reject: rejectAndNext.bind(this),
    };
    this.startRequestTimer(options);
    this.respBuffer = Buffer.alloc(0);
    this.sendCommand(command, options);
  }

  async sendCommand(command) {
    // TODO - look up known request length and limit it?
    const commandBuffer = Buffer.from(command);
    const CR = Buffer.from("\r");
    const CRC = getCRC(commandBuffer);
    const toSend = Buffer.concat([commandBuffer, CRC, CR]);
    this.hid.write(toSend);
  }

  startRequestTimer(options) {
    const requestTimeout = options.timeout || this.defaultTimeout;
    this.activeRequest.timeout = setTimeout(() => {
      this.reject(Error("Request timed out"));
    }, requestTimeout);
  }

  request(command, options) {
    return new Promise((resolve, reject) => {
      this.requestQ.push({ command, resolve, reject, options });
    });
  }

  reject(err) {
    if (!this.activeRequest) {
      return;
    }
    clearTimeout(this.activeRequest.timeout);
    this.activeRequest.reject(err);
  }

  resolve(data) {
    clearTimeout(this.activeRequest.timeout);
    this.activeRequest.resolve(data.toString());
  }
}

module.exports = AxpertMonitor;
