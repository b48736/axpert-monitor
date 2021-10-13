#!/usr/bin/env node

const AxpertTTY = require("../lib/axpertTTY");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { queryParsers } = require("../lib/queries/queries");
const sleep = require("util").promisify(setTimeout);
const argv = yargs(hideBin(process.argv))
  .options("command", {
    alias: "c",
    type: "string",
    description: "Inquery command like 'QID'",
  })
  .options("raw", {
    alias: "r",
    type: "boolean",
    description: "show raw output",
  })
  .options("port", {
    alias: "p",
    type: "string",
    description: "serial port to connect",
  }).argv;

const command = argv.command || "QID";
const displayRaw = argv.raw;
const port = argv.port;

if (command[0] !== "Q") {
  console.error("A Query must start with 'Q' - Exiting");
  process.exit(1);
}

console.log(`Sending command: ${command} on port ${port}`);

async function query() {
  let axpert = null;
  try {
    axpert = new AxpertTTY(port);
    console.log("before send");
    sleep(100);
    let resp = await axpert.request(command);
    console.log("after send");

    if (queryParsers[command] && !displayRaw) {
      resp = JSON.stringify(queryParsers[command](resp), null, 2);
    }
    console.log(resp);
  } catch (err) {
    console.log(err.message);
  }
  axpert.stop();
}

query();
