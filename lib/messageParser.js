const getCRC = require("./crc.js");
const shiftLeft = require("buffershift").shl;

function parseResp(data, { maxLength = 500, command }) {
  // if (data.length < 4) {
  //   throw Error(`Message too short: ${data.length}`);
  // }

  let startFound = false;

  while (startFound === false) {
    const startChar = data.toString("utf8", 0, 1);
    if (startChar === "(") {
      startFound = true;
      continue;
    }
    data = data.slice(1);
    if (data.length < 1) {
      throw Error(`Message start not found`);
    }
  }

  if (data.length > maxLength) {
    throw Error(`Message too long: ${data.length}`);
  }

  const messageEnd = data.lastIndexOf(0x0d);

  if (messageEnd < 0) {
    throw Error("No CR");
  }

  const wholeMessage = data.slice(0, messageEnd - 2);
  const messageCRC = data.slice(messageEnd - 2, messageEnd);
  const calculatedCRC = getCRC(wholeMessage);

  // if (process.env.SHOW_RAW === "true") {
  // console.log(data.toString("hex"));
  // console.log(data.toString());
  // }

  if (Buffer.compare(calculatedCRC, messageCRC) !== 0) {
    const err = Error(
      `CRC missmatch. Expected [${calculatedCRC.toString("hex")}] but got [${messageCRC.toString("hex")}]`
    );

    if (command !== "QOPM") {
      throw err;
    }

    // for QOPM the CRC is shifted by 4 bits for some reason
    const shiftedCRC = Buffer.from(calculatedCRC);
    shiftLeft(shiftedCRC, 4);

    if (Buffer.compare(messageCRC, shiftedCRC) !== 0) {
      throw err;
    }
  }

  const message = data.slice(1, messageEnd - 2);

  return message;
}

module.exports = parseResp;
