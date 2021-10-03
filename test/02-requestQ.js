const expect = require("chai").expect;
const sinon = require("sinon");
const HID = require("node-hid");
const mockHID = require("./mocks/mockHID");
const AxpertMonitor = require("../index");
const async = require("async");

describe("02 - requestQ", function () {
  this.timeout(30000);
  let monitor = null;

  before(() => {
    sinon.replace(HID, "HID", mockHID);
    monitor = new AxpertMonitor();
  });

  it("should throw error if command is not known", async () => {
    const testCommand = "ERROR";

    try {
      await monitor.request(testCommand);
      throw Error("unexpected");
    } catch (err) {
      expect(err.message).eql("Mock Error");
    }
  });

  it("should return response if command is known", async () => {
    const testCommand = "TEST";

    const response = await monitor.request(testCommand);
    expect(response).eql("TEST RESPONSE");
  });

  it("should process each request in order", async () => {
    const messageCount = 10;
    const testCommands = [];
    for (let i = 0; i < messageCount; i++) {
      testCommands.push(`ECHO:${i}`);
    }

    const responseOrder = [];

    await async.each(testCommands, async (testCommand) => {
      const resp = await monitor.request(testCommand);
      const order = parseInt(resp);
      responseOrder.push(order);
    });

    expect(responseOrder.length).eql(messageCount);
    for (let i = 0; i < messageCount; i++) {
      expect(responseOrder[i] < responseOrder[i + 1]);
    }
  });

  it("should time out", async () => {
    const timeout = 20;
    const testCommand = "TOO_LONG";
    const startTime = Date.now();
    try {
      await monitor.request(testCommand, { timeout });
      throw Error("unexpected");
    } catch (err) {
      expect(err.message).eql("Request timed out");
    }
    const deltaTime = Date.now() - startTime;
    expect(deltaTime).at.least(timeout);
  });

  it("time out after first response should not affect the next request", async () => {
    let testCommand = "TOO_LONG";

    try {
      await monitor.request(testCommand, { timeout: 20 });
      throw Error("unexpected");
    } catch (err) {
      expect(err.message).eql("Request timed out");
    }

    testCommand = "TEST";

    const response = await monitor.request(testCommand);
    expect(response).eql("TEST RESPONSE");
  });

  it("time out before first resposne should not affect the next request", async () => {
    let testCommand = "TOO_LONG";

    try {
      await monitor.request(testCommand, { timeout: 1 });
      throw Error("unexpected");
    } catch (err) {
      expect(err.message).eql("Request timed out");
    }

    testCommand = "TEST";

    const response = await monitor.request(testCommand);
    expect(response).eql("TEST RESPONSE");
  });

  it("should throw error if response CRC does not match", async () => {
    const testCommand = "BAD_RESPONSE";
    try {
      await monitor.request(testCommand);
      throw Error("unexpected");
    } catch (err) {
      expect(err.message).includes("CRC missmatch");
    }
  });

  it("should not reject twice if throw after timeout", async () => {
    const testCommand = "ERROR";

    try {
      await monitor.request(testCommand, { timeout: 1 });
      throw Error("unexpected");
    } catch (err) {
      expect(err.message).eql("Request timed out");
    }
  });
});
