const async = require("async");
const parseResp = require("./messageParser");
const getCRC = require("./crc.js");

class AxpertPort {
  constructor(defaultTimeout = 10000) {
    this.respBuffer = Buffer.alloc(0);
    this.defaultTimeout = defaultTimeout;
    this.requestQ = async.queue((...args) => {
      this.processRequestQ(...args);
    }, 1);
    this.activeRequest = null;
  }

  stop() {
    this.port.close();
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
      const message = parseResp(this.respBuffer, {
        command: this.activeRequest.command,
      });

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

  processRequestQ({ command, resolve, reject, options }, next) {
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
    let toSend = Buffer.concat([commandBuffer, CRC, CR]);

    // allow commands that are longer than 8 bytes after adding crc and cr
    while (toSend.length > 0) {
      const chunk = Buffer.concat([toSend.slice(0, 8)]);
      toSend = toSend.slice(8);
      this.port.write(chunk);
    }
  }

  startRequestTimer(options) {
    const requestTimeout = options.timeout || this.defaultTimeout;
    this.activeRequest.timeout = setTimeout(() => {
      this.reject(Error("Request timed out"));
    }, requestTimeout);
  }

  request(command, options = {}) {
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

module.exports = AxpertPort;
