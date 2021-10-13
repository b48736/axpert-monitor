#!/usr/bin/env node

const AxpertMonitor = require("../lib/axpertMonitor");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { queryParsers } = require("../lib/queries/queries");
const argv = yargs(hideBin(process.argv))
  .options("command", {
    alias: "c",
    type: "string",
    description: "Inquery command like 'QID'",
  })
  .options("raw", {
    alias: "r",
    type: "boolean",
    description: "show raw output, default=false",
  })
  .options("hid", {
    alias: "h",
    type: "string",
    description: "USB HID raw path, e.g. /dev/hidraw1",
  })
  .options("port", {
    alias: "p",
    type: "string",
    description: "Serial port for tty interface, e.g. /dev/ttyUSB0",
  })
  .options("vid", {
    alias: "V",
    type: "number",
    description: "VendorID to use for HID interface, default=0x665",
  })
  .options("pid", {
    alias: "P",
    type: "number",
    description: "ProductID to use for HID interface, default=0x5161",
  })
  .options("timeout", {
    alias: "t",
    type: "number",
    description: "query timeout in MS, default=10000",
  }).argv;

const command = argv.command || "QID";
const displayRaw = argv.raw;

if (command[0] !== "Q") {
  console.error("A Query must start with 'Q' - Exiting");
  process.exit(1);
}

console.log(`Sending command: ${command}`);

async function query() {
  let axpert = null;
  try {
    axpert = new AxpertMonitor(argv);
    let resp = await axpert.request(command);

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
