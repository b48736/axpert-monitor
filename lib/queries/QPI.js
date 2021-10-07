//PI<NN>
function format(rawResponse) {
  const protocolID = parseInt(rawResponse[2] + rawResponse[3]);
  return protocolID;
}

module.exports = format;
