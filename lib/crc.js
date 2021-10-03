const crc16xmodem = require("crc").crc16xmodem;

module.exports = getCRCBuff;

function getCRCBuff(data) {
  const crcNum = crc16xmodem(data);
  const crcBuff = Buffer.from(crcNum.toString(16), "hex");
  return Buffer.concat([crcBuff], 2); // force 2 byte response
}
