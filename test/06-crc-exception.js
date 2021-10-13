const expect = require("chai").expect;
const getCRC = require("../lib/crc");

describe("06 - crc exception", () => {
  it("should return a hardcoded CRC for POP02 message", async () => {
    const crcBuffer = getCRC(Buffer.from("POP02"));

    expect(crcBuffer[1]).eql(0x0b);
  });
});
