#!/usr/bin/env node

const AxpertUSB = require("../lib/axpertUSB");
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
    description: "show raw output",
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
    axpert = new AxpertUSB();
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
