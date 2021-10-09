#!/usr/bin/env node

const AxpertUSB = require("../lib/axpertUSB");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { queryParsers } = require("../lib/queries/queries");
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
    axpert = new AxpertUSB();
    const resp = await axpert.request(setCommand);
    console.log(resp);
  } catch (err) {
    console.log(err.message);
  }
  axpert.stop();
}

set();
