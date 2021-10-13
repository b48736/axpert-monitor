#!/usr/bin/env node

const AxpertMonitor = require("../lib/axpertMonitor");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv))
  .options("command", {
    alias: "c",
    type: "string",
    description: "set command like 'PoP'",
  })
  .options("value", {
    alias: "v",
    type: "string",
    description: "value to set",
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

if (!argv.command) {
  console.error("Missing command parameter");
  process.exit(1);
}

if (!argv.value) {
  console.error("Missing value parameter");
  process.exit(1);
}

const setCommand = `${argv.command}${argv.value}`;

console.log(`Sending command: '${setCommand}'`);

async function set() {
  let axpert = null;
  try {
    axpert = new AxpertMonitor(argv);
    const resp = await axpert.request(setCommand);
    console.log(resp);
  } catch (err) {
    console.log(err.message);
  }
  axpert.stop();
}

set();
