const expect = require("chai").expect;
const sinon = require("sinon");
const HID = require("node-hid");
const mockHID = require("./mocks/mockHID");
const AxpertMonitor = require("../index");
const async = require("async");
const sleep = require("util").promisify(setTimeout);

describe("04 - get interface", function () {
  this.timeout(30000);
  let axpert = null;

  before(() => {
    sinon.replace(HID, "HID", mockHID);
    axpert = new AxpertMonitor();
  });

  after(() => {
    sinon.restore();
  });

  it("should get formatted protocol ID", async () => {
    const response = await axpert.get.protocolID();
    expect(response).eql(30);
  });

  it("should get formatted serial number", async () => {
    const response = await axpert.get.serialNumber();
    expect(response).eql("92931905106463");
  });

  it("should get formatted firmware version", async () => {
    const response = await axpert.get.firmwareVersion();
    expect(response).eql(71.71);
  });

  it("should get formatted device rating", async () => {
    const response = await axpert.get.deviceRating();
    expect(response).property("gridVoltage", 230.0);
    expect(response).property("gridCurrent", 21.7);
    expect(response).property("outputVoltage", 230);
    expect(response).property("outputFrequency", 50);
    expect(response).property("outputCurrent", 21.7);
    expect(response).property("outputPowerApparent", 5000);
    expect(response).property("outputPowerActive", 5000);
    expect(response).property("batteryVoltage", 48);
    expect(response).property("batteryVoltageRecharge", 51);
    expect(response).property("batteryVoltageUnder", 49);
    expect(response).property("batteryVoltageBulk", 54.4);
    expect(response).property("batteryVoltageFloat", 54.4);
    expect(response).property("batteryType", "User");
    expect(response).property("chargingCurrentMaxAC", 60);
    expect(response).property("chargingCurrentMaxTotal", 60);
    expect(response).property("inputVoltageRange", "UPS");
    expect(response).property("outputSourcePriority", "[SOL] Solar first");
    expect(response).property("chargeSourcePriority", "[SNU] Solar + Utility");
    expect(response).property("parallelMax", 9);
    expect(response).property("inverterType", "Off Grid");
    expect(response).property("topology", "Transformerless");
    expect(response).property("outputMode", "Transformer");
    expect(response).property("batteryVoltageRedischarge", 53);
    expect(response).property("PVOK", "At least one");
    expect(response).property("PVOK", "At least one");
    expect(response).property("PVPowerBalance", "Max charge current plus load");
  });

  it("should get formatted status flag", async () => {
    const response = await axpert.get.statusFlags();
    expect(response).property("silenceBuzzer", false);
    expect(response).property("overloadBypass", true);
    expect(response).property("powerSaving", false);
    expect(response).property("displayEscapeTimeout", false);
    expect(response).property("overloadRestart", false);
    expect(response).property("overTempRestart", false);
    expect(response).property("backlightOn", true);
    expect(response).property("alarmOnPrimaryInterrupt", false);
    expect(response).property("faultCodeRecord", false);
  });
});
