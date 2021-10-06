const AxpertUSB = require("../lib/axpertUSB");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).options("command", {
  alias: "c",
}).argv;

const command = argv.command || "QID";

if (command[0] !== "Q") {
  console.error("A Query must start with 'Q' - Exiting");
  process.exit(1);
}

console.log(`Sending command: ${command}`);

async function query() {
  let axpert = null;
  try {
    axpert = new AxpertUSB();
    const resp = await axpert.request(command);
    console.log(resp);
  } catch (err) {
    console.log(err.message);
  }
  axpert.stop();
}

query();
