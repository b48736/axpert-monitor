const _ = require("lodash");

const STATUS_FALSE = "OK";
const STATUS_WARN = "Warning";
const STATUS_FAULT = "Fault";
const STATUS_COMPILE = "compile";

const WARNING_BITS = {
  inverterFault: {
    offset: 1,
    status: STATUS_FAULT,
  },
  busOver: {
    offset: 2,
    status: STATUS_FAULT,
  },
  busUnder: {
    offset: 3,
    status: STATUS_FAULT,
  },
  busSoftFail: {
    offset: 4,
    status: STATUS_FAULT,
  },
  lineFail: {
    offset: 5,
    status: STATUS_WARN,
  },
  opvShort: {
    offset: 6,
    status: STATUS_WARN,
  },
  inverterVoltageLow: {
    offset: 7,
    status: STATUS_FAULT,
  },
  inverterVoltageHigh: {
    offset: 8,
    status: STATUS_FAULT,
  },
  overTemp: {
    offset: 9,
    status: STATUS_COMPILE,
  },
  fanLocked: {
    offset: 10,
    status: STATUS_COMPILE,
  },
  batteryVoltageHigh: {
    offset: 11,
    status: STATUS_COMPILE,
  },
  batteryLowAlarm: {
    offset: 12,
    status: STATUS_WARN,
  },
  batteryUnderShutdown: {
    offset: 14,
    status: STATUS_WARN,
  },
  overLoad: {
    offset: 16,
    status: STATUS_COMPILE,
  },
  eepromFault: {
    offset: 17,
    status: STATUS_WARN,
  },
  inverterOverCurrent: {
    offset: 18,
    status: STATUS_FAULT,
  },
  inverterSoftFail: {
    offset: 19,
    status: STATUS_FAULT,
  },
  selfTestFail: {
    offset: 20,
    status: STATUS_FAULT,
  },
  opDcVoltageOver: {
    offset: 21,
    status: STATUS_FAULT,
  },
  batOpen: {
    offset: 22,
    status: STATUS_FAULT,
  },
  currentSensorFail: {
    offset: 23,
    status: STATUS_FAULT,
  },
  batteryShort: {
    offset: 24,
    status: STATUS_FAULT,
  },
  powerLimit: {
    offset: 25,
    status: STATUS_WARN,
  },
  pvVoltageHigh: {
    offset: 26,
    status: STATUS_WARN,
  },
  mpptOverloadFault: {
    offset: 27,
    status: STATUS_WARN,
  },
  mpptOverloadWarning: {
    offset: 28,
    status: STATUS_WARN,
  },
  batteryTooLowToCharge: {
    offset: 29,
    status: STATUS_WARN,
  },
};

function format(rawResponse) {
  const inverterFault = rawResponse[1] === "1";
  const result = {};

  _.forEach(WARNING_BITS, (property, name) => {
    const bitSet = rawResponse[property.offset] === "1";

    if (!bitSet) {
      result[name] = STATUS_FALSE;
      return;
    }

    if (property.status === STATUS_COMPILE) {
      result[name] = inverterFault ? STATUS_FAULT : STATUS_WARN;
    } else {
      result[name] = property.status;
    }
  });

  return result;
}

module.exports = format;
