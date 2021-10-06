async function getProtocolID(request) {
  const command = "QPI";
  const rawResponse = await request(command);
  return format(rawResponse);
}

//PI<NN>
function format(rawResponse) {
  const protocolID = parseInt(rawResponse[2] + rawResponse[3]);
  return protocolID;
}

module.exports = { getProtocolID, QPI: format };
