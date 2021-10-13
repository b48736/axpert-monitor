const expect = require("chai").expect;
const AxpertMonitor = require("../index");

describe("05 - tty", () => {
  it("should create a tty instance with specified port", async () => {
    const options = {
      port: "/dev/ttyUSBX",
    };

    const axpert = new AxpertMonitor(options);

    expect(axpert.port.constructor.name).eql("SerialPort");
    expect(axpert.port.path).eql(options.port);
  });
});
