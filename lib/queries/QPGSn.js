const _ = require("lodash");
const MODES = require("./QMOD").MODES;

const FAULT_CODES = {
  "00": "[00] OK",
  "01": "[01] Fan is locked",
  "02": "[02] Over temperature",
  "03": "[03] Battery voltage is too high",
  "04": "[04] Battery voltage is too low",
  "05": "[05] Output short circuited or Over temperature",
  "06": "[06] Output voltage is too high",
  "07": "[07] Over load time out",
  "08": "[08] Bus voltage is too high",
  "09": "[09] Bus soft start failed",
  11: "[11] Main relay failed",
  51: "[51] Over current inverter",
  52: "[52] Bus soft start failed",
  53: "[53] Inverter soft start failed",
  54: "[54] Self-test failed",
  55: "[55] Over DC voltage on output of inverter",
  56: "[56] Battery connection is open",
  57: "[57] Current sensor failed",
  58: "[58] Output voltage is too low",
  60: "[60] Inverter negative power",
  71: "[71] Parallel version different",
  72: "[72] Output circuit failed",
  80: "[80] CAN communication failed",
  81: "[81] Parallel host line lost",
  82: "[82] Parallel synchronized signal lost",
  83: "[83] Parallel battery voltage detect different",
  84: "[84] Parallel Line voltage or frequency detect different",
  85: "[85] Parallel Line input current unbalanced",
  86: "[86] Parallel output setting different",
};

const OUTPUT_MODES = {
  0: "Single",
  1: "Parallel",
  2: "Phase 1 of 3",
  3: "Phase 2 of 3",
  4: "Phase 3 of 3",
};

const CHARGE_SOURCE_PRIORITY = {
  0: "[CUt] Utility first",
  1: "[CSO] Solar first",
  2: "[SNU] Solar + Utility",
  3: "[OSO] Only solar charging permitted",
};

const INVERTER_STATUS_KEYS = [
  "sccOK",
  "chargingAC",
  "chargingSCC",
  "batteryOpen",
  "batteryUnder",
  "lineLoss",
  "loadOn",
  "configChange",
];

// A BBBBBBBBBBBBBB C DD EEE.E FF.FF GGG.G HH.HH IIII JJJJ KKK LL.L MMM NNN OOO.O PPP QQQQQ RRRRR SSS b7b6b5b4b3b2b1b0 T U VVV WWW ZZ XX YYY

const PARALLEL_STATUS_PROPERTIES = {
  serialNumber: { offset: 1, type: "float", unit: "Hz" },
  mode: { offset: 2, type: "enum", enum: MODES },
  faultCode: { offset: 3, type: "enum", enum: FAULT_CODES },
  gridVoltage: { offset: 4, type: "float", unit: "V" },
  gridFrequency: { offset: 5, type: "float", unit: "Hz" },
  outputVoltage: { offset: 6, type: "float", unit: "V" },
  outputFrequency: { offset: 7, type: "float", unit: "Hz" },
  outputPowerApparent: { offset: 8, type: "int", unit: "VA" },
  outputPowerActive: { offset: 9, type: "int", unit: "W" },
  loadPercent: { offset: 10, type: "int", unit: "%" },
  batteryVoltage: { offset: 11, type: "float", unit: "V" },
  batteryChargingCurrent: { offset: 12, type: "int", unit: "A" },
  batteryCapacity: { offset: 13, type: "float", unit: "%" },
  pvInputVoltage: { offset: 14, type: "float", unit: "V" },
  chargingCurrentTotal: { offset: 15, type: "int", unit: "A" },
  outputPowerApparentTotal: { offset: 16, type: "int", unit: "VA" },
  outputPowerActiveTotal: { offset: 17, type: "int", unit: "W" },
  outputPowerPercentageTotal: { offset: 18, type: "int", unit: "%" },
  inverterStatus: { offset: 19, type: "packedBits", bitKeys: INVERTER_STATUS_KEYS },
  outputMode: { offset: 20, type: "enum", enum: OUTPUT_MODES },
  chargeSourcePriority: { offset: 21, type: "enum", enum: CHARGE_SOURCE_PRIORITY },
  chargingCurrentMax: { offset: 22, type: "int", unit: "A" },
  chargingRangeMax: { offset: 23, type: "int", unit: "A" },
  chargingCurrentMaxAC: { offset: 24, type: "int", unit: "A" },
  pvBatteryCurrent: { offset: 25, type: "int", unit: "A" },
  batteryDischargeCurrent: { offset: 26, type: "int", unit: "A" },
};

function format(rawResponse) {
  const rawParts = rawResponse.split(" ");
  const result = {};

  if (rawParts[0] === "0") return result;

  _.forEach(PARALLEL_STATUS_PROPERTIES, (property, name) => {
    const value = rawParts[property.offset];
    switch (property.type) {
      case "int":
        result[name] = parseInt(value);
        break;

      case "float":
        result[name] = parseFloat(value);
        break;

      case "enum":
        result[name] = property.enum[value];
        break;

      case "packedBits":
        result[name] = {};
        _.forEach(value, (bitValue, offset) => {
          result[name][property.bitKeys[offset]] = bitValue === "1";
        });
        break;
    }
  });

  return result;
}

module.exports = format;
