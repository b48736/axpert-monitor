async function getSerialNumber(request) {
  const command = "QID";
  return await request(command); // no formatting needed
}

module.exports = getSerialNumber;
