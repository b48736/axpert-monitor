const _ = require("lodash");

const MODES = {
  P: "Power On",
  S: "Standby",
  L: "Line",
  B: "Battery",
  F: "Fault",
  H: "Power Savings",
};

function format(rawResponse) {
  return MODES[rawResponse];
}

module.exports = format;
