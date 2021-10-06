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

  after(() => {
    sinon.restore();
  });

  it("should reject request if there is an error", async () => {
    const testCommand = "ERR";

    try {
      await monitor.request(testCommand);
      throw Error("unexpected");
    } catch (err) {
      expect(err.message).eql("Mock Error");
    }
  });

  it("should resolve with response if request is successful", async () => {
    const testCommand = "TEST";

    const response = await monitor.request(testCommand);
    expect(response).eql("TEST RESPONSE");
  });

  it("should process each request in order", async () => {
    const messageCount = 10;
    const testCommands = [];
    for (let i = 0; i < messageCount; i++) {
      testCommands.push(`E:${i}`);
    }

    const qSpy = sinon.spy(monitor, "processRequestQ");

    const responseOrder = [];

    await async.each(testCommands, async (testCommand) => {
      const resp = await monitor.request(testCommand);
      const order = parseInt(resp);
      responseOrder.push(order);
    });

    expect(responseOrder.length).eql(messageCount);
    expect(qSpy.callCount).eql(messageCount);

    for (let i = 0; i < messageCount; i++) {
      expect(qSpy.args[i][0].command).eql(testCommands[i]);
      expect(responseOrder[i] < responseOrder[i + 1]);
    }
  });

  it("should reject request after time out", async () => {
    const timeout = 20;
    const testCommand = "LONG";
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
    let testCommand = "LONG";

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
    let testCommand = "LONG";

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

  it("should split long requests into chuks of at most 8 bytes", async () => {
    const testCommand = "LONGLONG";

    const writeSpy = sinon.spy(monitor.hid, "write");

    // this will throw, but at least check if write is called twice
    try {
      await monitor.request(testCommand);
    } catch (err) {
      // ignore error for unsupported message
    }

    expect(writeSpy.callCount).eql(2);
    expect(writeSpy.args[0][0].length).eql(8);
    expect(writeSpy.args[1][0].length).eql(3);
    writeSpy.restore();
  });
});
