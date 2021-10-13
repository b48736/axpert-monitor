const expect = require("chai").expect;
const sinon = require("sinon");
const HID = require("node-hid");
const AxpertMonitor = require("../index");

describe("01 - hid", () => {
  it("should create an instance with default VID & PID", async () => {
    const hidStub = sinon.stub(HID, "HID").returns({ on: () => {} });
    new AxpertMonitor();
    expect(hidStub.callCount).eql(1);
    expect(hidStub.args[0][0]).eql(1637);
    expect(hidStub.args[0][1]).eql(20833);
    hidStub.restore();
  });

  it("should create an instance with specified hid path", async () => {
    const hidStub = sinon.stub(HID, "HID").returns({ on: () => {} });
    const options = {
      hid: "/dev/hidrawX",
    };
    new AxpertMonitor(options);
    expect(hidStub.callCount).eql(1);
    expect(hidStub.args[0][0]).eql(options.hid);
    hidStub.restore();
  });

  it("should create an instance with overwritten VID & PID", async () => {
    const vid = 1;
    const pid = 2;
    const hidStub = sinon.stub(HID, "HID").returns({ on: () => {} });
    new AxpertMonitor({ vid, pid });
    expect(hidStub.callCount).eql(1);
    expect(hidStub.args[0][0]).eql(vid);
    expect(hidStub.args[0][1]).eql(pid);
    hidStub.restore();
  });

  it("should throw if VID & PID is not found", async () => {
    const vid = 1;
    const pid = 2;
    try {
      new AxpertMonitor({ vid, pid });
      throw Error("unexpected");
    } catch (err) {
      expect(err.message).contains("cannot open device");
    }
  });

  it("should close HID on stop", async () => {
    const hidStub = sinon.stub(HID, "HID").returns({ on: () => {}, close: () => {} });

    const axpert = new AxpertMonitor();

    const closeSpy = sinon.spy(axpert.port, "close");
    axpert.stop();

    expect(closeSpy.callCount).eql(1);
    closeSpy.restore();
    hidStub.restore();
  });
});
