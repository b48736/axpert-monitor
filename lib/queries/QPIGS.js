const _ = require("lodash");

const STATUS_BIT_KEYS = [
  "addSBUPriorityVersion",
  "configChanged",
  "sccFirmwareUpdates",
  "loadOn",
  "batteryVoltToSteady",
  "charging",
  "chargingSCC",
  "chargingAC",
];

//BBB.B CC.C DDD.D EE.E FFFF GGGG HHH III JJ.JJ KKK OOO TTTT EEEE UUU.U WW.WW PPPPP b7b6b5b4b3b2b1b0

const GENERAL_STATUS_PROPERTIES = {
  gridVoltage: { offset: 0, type: "float", unit: "V" }, // BBB.B
  gridFrequency: { offset: 1, type: "float", unit: "Hz" }, // CC.C
  outputVoltage: { offset: 2, type: "float", unit: "V" }, // DDD.D
  outputFrequency: { offset: 3, type: "float", unit: "Hz" }, // EE.E
  outputPowerApparent: { offset: 4, type: "int", unit: "VA" }, // FFFF
  outputPowerActive: { offset: 5, type: "int", unit: "W" }, // GGGG
  outputLoadPercent: { offset: 6, type: "int", unit: "%" }, // HHH
  busVoltage: { offset: 7, type: "int", unit: "V" }, // III
  batteryVoltage: { offset: 8, type: "float", unit: "V" }, // JJ.JJ
  batteryChargingCurrent: { offset: 9, type: "int", unit: "A" }, // KKK
  batteryCapacity: { offset: 10, type: "int", unit: "%" }, // OOO
  temperature: { offset: 11, type: "int", unit: "degC" }, // TTTT
  pvBatteryCurrent: { offset: 12, type: "int", unit: "A" }, // EEEE
  pvInputVoltage: { offset: 13, type: "float", unit: "A" }, //UUU.U
  batteryVoltageSCC: { offset: 14, type: "float", unit: "A" }, // WW.WW
  batteryDischargeCurrent: { offset: 15, type: "int", unit: "A" }, // PPPPP
  status: { offset: 16, type: "packedBits", bitKeys: STATUS_BIT_KEYS },
  // Undocumented data
  // A: { offset: 17, type: "int", unit: "" },
  // B: { offset: 18, type: "int", unit: "" },
  pvPower: { offset: 19, type: "int", unit: "W" },
};

function format(rawResponse) {
  const rawParts = rawResponse.split(" ");
  const result = {};

  _.forEach(GENERAL_STATUS_PROPERTIES, (property, name) => {
    const value = rawParts[property.offset];
    switch (property.type) {
      case "int":
        result[name] = parseInt(value);
        break;

      case "float":
        result[name] = parseFloat(value);
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
