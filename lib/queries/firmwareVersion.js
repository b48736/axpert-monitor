async function getFirmwareVersion(request) {
  const command = "QVFW";
  const rawResponse = await request(command);
  return format(rawResponse);
}

//VERFW:<NNNNN.NN>
function format(rawResponse) {
  const versionString = rawResponse.split("VERFW:").pop();
  return parseFloat(versionString);
}

module.exports = { getFirmwareVersion, QVFW: format };
