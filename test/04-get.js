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

  it("should get formatted general device status", async () => {
    const response = await axpert.get.generalStatus();
    expect(response).property("gridVoltage", 233.8);
    expect(response).property("gridFrequency", 49.8);
    expect(response).property("outputVoltage", 230.2);
    expect(response).property("outputFrequency", 49.8);
    expect(response).property("outputPowerApparent", 277);
    expect(response).property("outputPowerActive", 250);
    expect(response).property("outputLoadPercent", 5);
    expect(response).property("busVoltage", 363);
    expect(response).property("batteryVoltage", 52);
    expect(response).property("batteryChargingCurrent", 0);
    expect(response).property("batteryCapacity", 28);
    expect(response).property("temperature", 45);
    expect(response).property("PVBatteryCurrent", 0);
    expect(response).property("PVInputVoltage", 289.6);
    expect(response).property("batteryVoltageSCC", 0);
    expect(response).property("batteryDischargeCurrent", 1);
    expect(response).property("status");
    expect(response.status).property("addSBUPriorityVersion", false);
    expect(response.status).property("configChanged", false);
    expect(response.status).property("sccFirmwareUpdates", false);
    expect(response.status).property("loadOn", true);
    expect(response.status).property("batteryVoltToSteady", false);
    expect(response.status).property("charging", false);
    expect(response.status).property("chargingSCC", true);
    expect(response.status).property("chargingAC", false);
  });

  it("should get formatted device mode", async () => {
    const response = await axpert.get.mode();
    expect(response).eql("Battery");
  });

  it("should get formatted warning device status", async () => {
    const response = await axpert.get.warningStatus();
    expect(response).property("inverterFault", "Fault");
    expect(response).property("busOver", "OK");
    expect(response).property("busUnder", "OK");
    expect(response).property("busSoftFail", "OK");
    expect(response).property("lineFail", "OK");
    expect(response).property("opvShort", "OK");
    expect(response).property("inverterVoltageLow", "OK");
    expect(response).property("inverterVoltageHigh", "OK");
    expect(response).property("overTemp", "OK");
    expect(response).property("fanLocked", "OK");
    expect(response).property("batteryVoltageHigh", "Fault");
    expect(response).property("batteryLowAlarm", "OK");
    expect(response).property("batteryUnderShutdown", "OK");
    expect(response).property("overLoad", "OK");
    expect(response).property("eepromFault", "OK");
    expect(response).property("inverterOverCurrent", "OK");
    expect(response).property("inverterSoftFail", "OK");
    expect(response).property("selfTestFail", "OK");
    expect(response).property("opDcVoltageOver", "OK");
    expect(response).property("batOpen", "OK");
    expect(response).property("currentSensorFail", "OK");
    expect(response).property("batteryShort", "OK");
    expect(response).property("powerLimit", "OK");
    expect(response).property("pvVoltageHigh", "OK");
    expect(response).property("mpptOverloadFault", "OK");
    expect(response).property("mpptOverloadWarning", "OK");
    expect(response).property("batteryTooLowToCharge", "OK");
  });
});
