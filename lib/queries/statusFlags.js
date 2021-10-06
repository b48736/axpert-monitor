const _ = require("lodash");

async function getStatusFlags(request) {
  const command = "QFLAG";
  const rawResponse = await request(command);
  return format(rawResponse);
}

/*
ExxxDxxx is the flag status. E means enable, D means disable

A Enable/disable silence buzzer or open buzzer
B Enable/Disable overload bypass function
J Enable/Disable power saving
K Enable/Disable LCD display escape to default page after 1min timeout
U Enable/Disable overload restart
V Enable/Disable over temperature restart
X Enable/Disable backlight on
Y Enable/Disable alarm on when primary source interrupt
Z Enable/Disable fault code record
*/

const STATUS_FLAGS = {
  a: "silenceBuzzer",
  b: "overloadBypass",
  j: "powerSaving",
  k: "displayEscapeTimeout",
  u: "overloadRestart",
  v: "overTempRestart",
  x: "backlightOn",
  y: "alarmOnPrimaryInterrupt",
  z: "faultCodeRecord",
};

function format(rawResponse) {
  // remove Leading E
  rawResponse = rawResponse.slice(1);
  const enabled = rawResponse.split("D")[0];
  const disabled = rawResponse.split("D").pop();

  const status = {};

  _.forEach(enabled, (flag) => {
    status[STATUS_FLAGS[flag]] = true;
  });

  _.forEach(disabled, (flag) => {
    status[STATUS_FLAGS[flag]] = false;
  });

  return status;
}

module.exports = { getStatusFlags, QFLAG: format };
