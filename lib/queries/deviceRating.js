const _ = require("lodash");

async function getDeviceRating(request) {
  const command = "QPIRI";
  const rawResponse = await request(command);
  return format(rawResponse);
}

//BBB.B CC.C DDD.D EE.E FF.F HHHH IIII JJ.J KK.K JJ.J KK.K LL.L O PP QQ0 O P Q R SS T U VV.V W X
/*
B BBB.B Grid rating voltage - B is an integer ranging from 0 to 9. The units is V.
C CC.C Grid rating current - C is an Integer ranging from 0 to 9. The units is A.
D DDD.D AC output rating voltage - D is an Integer ranging from 0 to 9. The units is V.
E EE.E AC output rating frequency - E is an Integer ranging from 0 to 9. The units is Hz.
F FF.F AC output rating current - F is an Integer ranging from 0 to 9. The unit is A.
H HHHH AC output rating apparent power - H is an Integer ranging from 0 to 9. The unit is VA.
I IIII AC output rating active power - I is an Integer ranging from 0 to 9. The unit is W.
J JJ.J Battery rating voltage - J is an Integer ranging from 0 to 9. The units is V.
K KK.K Battery re-charge voltage - K is an Integer ranging from 0 to 9. The units is V.
l JJ.J Battery under voltage - J is an Integer ranging from 0 to 9. The units is V.
M KK.K Battery bulk voltage - K is an Integer ranging from 0 to 9. The units is V.
N LL.L Battery float voltage - L is an Integer ranging from 0 to 9. The units is V.
O O Battery type
  0: AGM
  1: Flooded
  2: User
P PP Current max AC charging current - P is an Integer ranging from 0 to 9. The units is A.
Q QQ0 Current max charging current - Q is an Integer ranging from 0 to 9. The units is A.
O O Input voltage range 
  0: Appliance
  1: UPS
P P Output source priority
  0: Utility first
  1: Solar first
  2: SBU first
Q Q Charger source priority
  For HS Series:
    0: Utility first
    1: Solar first
    2: Solar + Utility
    3: Only solar charging permitted
  For MS/MSX Series 1K~3K:
    0: Utility first
    1: Solar first
    2: Solar + Utility
    3: Only solar charging permitted
R R Parallel max num R is an Integer ranging from 0 to 9.
S SS Machine type
  00: Grid tie;
  01: Off Grid;
  10: Hybrid.
T T Topology
  0 transformerless
  1 transformer
U U Output mode
  00: single machine output
  01: parallel output
  02: Phase 1 of 3 Phase output
  03: Phase 2 of 3 Phase output
  04: Phase 3 of 3 Phase output
V VV.V Battery re-discharge voltage - V is an Integer ranging from 0 to 9. The units is V.
W W PV OK condition for parallel
  0: As long as one unit of inverters has connect PV, parallel system will consider PV OK;
  1: Only All of inverters have connect PV, parallel system will consider PV OK
X X PV power balance 
  0: PV input max current will be the max charged current;
  1: PV input max power will be the sum of the max charged power and loads power.
*/

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

module.exports = { getDeviceRating, QPIRI: format };
