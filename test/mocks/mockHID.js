const EventEmitter = require("events");
const sleep = require("util").promisify(setTimeout);
const getCRC = require("../../lib/crc");
const async = require("async");
const CR = Buffer.from("\r");
const { sampleQueryResponses, alternativeQueryResponses, errorQueryResponses } = require("./sampleData");

const MESSAGES = {
  TEST: `(TEST RESPONSE`,
  LONG: `(${Buffer.alloc(500, "X").toString()}`,
  STRT: `NO START CHARACTER`,
  END: `(MISSING END CR`,
};

class mockHID extends EventEmitter {
  constructor() {
    super();
    this.count = 0;
    this.responseQ = async.queue(async (task) => {
      await this.sendResponseBuffer(task);
    });
  }

  close() {}

  write(command) {
    const messageLength = command.length - 3;
    const commandString = command.slice(0, messageLength).toString();
    if (commandString.includes("E:")) {
      const echo = commandString.split("E:").pop();
      this.respond(`(${echo}`);
      return;
    }

    // use sample responses for known Queries
    if (commandString[0] === "Q") {
      const resp = getSampleResponse(commandString);
      if (resp.length === 0) {
        throw Error(`No sample data for command: ${commandString}`);
      }
      this.responseQ.push(resp);
      return;
    }

    switch (commandString) {
      // case "SHORT":
      //   return this.respond("");
      //   break;

      // case "LONG":
      //   this.respond(`(${Buffer.alloc(500, "X").toString()}`);
      //   break;

      case "CRC":
        this.responseQ.push(Buffer.from("(BAD RESPONSE CRC**\r"));
        break;

      case "DUB":
        this.responseQ.push(Buffer.from("(BAD RESPONSE**\r"));
        this.respond(MESSAGES.TEST);
        break;

      case "END":
        this.responseQ.push(Buffer.concat([Buffer.from(MESSAGES[commandString]), getCRC(MESSAGES[commandString])]));
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
      return;
    }

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

function getSampleResponse(commandString) {
  if (process.env.ALT_DATASET === "true") {
    return Buffer.from(alternativeQueryResponses[commandString].raw, "hex");
  }

  if (process.env.ERROR_DATASET === "true") {
    return Buffer.from(errorQueryResponses[commandString].raw, "hex");
  }

  return Buffer.from(sampleQueryResponses[commandString].raw, "hex");
}

module.exports = mockHID;
