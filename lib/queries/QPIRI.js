const _ = require("lodash");

//BBB.B CC.C DDD.D EE.E FF.F HHHH IIII JJ.J KK.K JJ.J KK.K LL.L O PP QQ0 O P Q R SS T U VV.V W X

const RATING_PROPERTIES = {
  gridVoltage: {
    offset: 0,
    type: "float",
    unit: "V",
  },
  gridCurrent: { offset: 1, type: "float", unit: "A" },
  outputVoltage: { offset: 2, type: "float", unit: "V" },
  outputFrequency: { offset: 3, type: "float", unit: "Hz" },
  outputCurrent: { offset: 4, type: "float", unit: "A" },
  outputPowerApparent: { offset: 5, type: "int", unit: "VA" },
  outputPowerActive: { offset: 6, type: "int", unit: "W" },
  batteryVoltage: { offset: 7, type: "float", unit: "V" },
  batteryVoltageRecharge: { offset: 8, type: "float", unit: "V" },
  batteryVoltageUnder: { offset: 9, type: "float", unit: "V" },
  batteryVoltageBulk: { offset: 10, type: "float", unit: "V" },
  batteryVoltageFloat: { offset: 11, type: "float", unit: "V" },
  batteryType: {
    offset: 12,
    type: "enum",
    enum: { 0: "AGM", 1: "Flooded", 2: "User" },
  },
  chargingCurrentMaxAC: { offset: 13, type: "float", unit: "A" },
  chargingCurrentMaxTotal: { offset: 14, type: "float", unit: "A" },
  inputVoltageRange: {
    offset: 15,
    type: "enum",
    enum: { 0: "Appliance", 1: "UPS" },
  },
  outputSourcePriority: {
    offset: 16,
    type: "enum",
    enum: {
      0: "[UtI] Utility first",
      1: "[SOL] Solar first",
      2: "[SBU] SBU first",
    },
  },
  chargeSourcePriority: {
    offset: 17,
    type: "enum",
    enum: {
      0: "[CUt] Utility first",
      1: "[CSO] Solar first",
      2: "[SNU] Solar + Utility",
      3: "[OSO] Only solar charging permitted",
    },
  },
  parallelMax: { offset: 18, type: "int", unit: "#" },
  inverterType: {
    offset: 19,
    type: "enum",
    enum: {
      "00": "Grid tie",
      "01": "Off Grid",
      10: "Hybrid",
    },
  },
  topology: {
    offset: 20,
    type: "enum",
    enum: {
      0: "Transformerless",
      1: "Transformer",
    },
  },
  outputMode: {
    offset: 21,
    type: "enum",
    enum: {
      0: "Transformerless",
      1: "Transformer",
    },
  },
  batteryVoltageRedischarge: { offset: 22, type: "float", unit: "V" },
  PVOK: {
    offset: 23,
    type: "enum",
    enum: {
      0: "At least one",
      1: "All",
    },
  },
  PVPowerBalance: {
    offset: 24,
    type: "enum",
    enum: {
      0: "Max charge current",
      1: "Max charge current plus load",
    },
  },
};

function format(rawResponse) {
  const rawParts = rawResponse.split(" ");
  const result = {};

  _.forEach(RATING_PROPERTIES, (property, name) => {
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
    }
  });

  return result;
}

module.exports = format;
