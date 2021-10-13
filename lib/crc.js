const crc16xmodem = require("crc").crc16xmodem;

module.exports = getCRCBuff;

function getCRCBuff(data) {
  const crcNum = crc16xmodem(data);
  const crcBuff = Buffer.from(crcNum.toString(16), "hex");

  // handle Axpert firmware bug
  // https://github.com/JosefKrieglstein/AxpertControl
  if (data.toString() === "POP02") {
    return Buffer.from([0xe2, 0x0b]);
  }

  return Buffer.concat([crcBuff], 2); // force 2 byte response
}
