const EventEmitter = require("events");
const sleep = require("util").promisify(setTimeout);
const getCRC = require("../../lib/crc");
const async = require("async");

const MESSAGES = {
  TEST: "(TEST RESPONSE",
  TOO_LONG: `(${Buffer.alloc(500, "X").toString()}`,
};

class mockHID extends EventEmitter {
  constructor() {
    super();
    this.count = 0;
    this.responseQ = async.queue(async (task) => {
      await this.sendResponseBuffer(task);
    });
  }

  async write(command) {
    const messageLength = command.length - 3;
    const commandString = command.slice(0, messageLength).toString();
    if (commandString.includes("ECHO:")) {
      const echo = commandString.split("ECHO:").pop();
      this.respond(`(${echo}`);
      return;
    }

    switch (commandString) {
      // case "TOO_SHORT":
      //   return this.respond("");
      //   break;

      // case "TOO_LONG":
      //   this.respond(`(${Buffer.alloc(500, "X").toString()}`);
      //   break;

      case "BAD_RESPONSE":
        this.responseQ.push(Buffer.from("(BAD RESPONSE**\r"));
        break;

      case "DOUBLE_RESPONSE":
        this.responseQ.push(Buffer.from("(BAD RESPONSE**\r"));
        this.respond(MESSAGES.TEST);
        break;

      default:
        this.respond(MESSAGES[commandString]);
        break;
    }
  }

  async respond(resp) {
    if (resp === undefined) {
      await sleep(10);
      this.emit("error", Error("Mock Error"));
    }

    const CR = Buffer.from("\r");
    const respBuffer = Buffer.concat([Buffer.from(resp), getCRC(resp), CR]);
    this.responseQ.push(respBuffer);
  }

  async sendResponseBuffer(respBuffer) {
    await sleep(10);
    while (respBuffer.length > 0) {
      const chunk = Buffer.concat([respBuffer.slice(0, 8)], 8);
      respBuffer = respBuffer.slice(8);
      this.emit("data", chunk);
      await sleep(5);
    }
  }
}

module.exports = mockHID;
