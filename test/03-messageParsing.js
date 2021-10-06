const expect = require("chai").expect;
const sinon = require("sinon");
const HID = require("node-hid");
const mockHID = require("./mocks/mockHID");
const AxpertUSB = require("../index");
const async = require("async");
const sleep = require("util").promisify(setTimeout);

describe("03 - message parsing", function () {
  this.timeout(30000);
  let axpert = null;

  before(() => {
    sinon.replace(HID, "HID", mockHID);
    axpert = new AxpertUSB();
  });

  after(() => {
    sinon.restore();
  });

  it("should time out if response does not have a valid start", async () => {
    const testCommand = "STRT";
    try {
      await axpert.request(testCommand, { timeout: 100 });
      throw Error("unexpected");
    } catch (err) {
      expect(err.message).eql("Request timed out");
    }
  });

  it("should time out if response does not have a valid end", async () => {
    const testCommand = "END";
    try {
      await axpert.request(testCommand, { timeout: 100 });
      throw Error("unexpected");
    } catch (err) {
      expect(err.message).eql("Request timed out");
    }
  });

  it("should reject request if response CRC is incorrect", async () => {
    const testCommand = "CRC";
    try {
      await axpert.request(testCommand);
      throw Error("unexpected");
    } catch (err) {
      expect(err.message).includes("CRC missmatch");
    }
  });

  it("should not reject twice if request times out and response is an error", async () => {
    const testCommand = "ERROR";

    try {
      await axpert.request(testCommand, { timeout: 1 });
      throw Error("unexpected");
    } catch (err) {
      expect(err.message).eql("Request timed out");
    }

    // wait for error to be emitted from HID and ignored...
    await sleep(50);
  });

  it("should ignore CRC error for QOPM command", async () => {
    const testCommand = "QOPM";
    const response = await axpert.request(testCommand);
    expect(response).eql("01");
  });
});
