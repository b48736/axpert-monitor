//VERFW:<NNNNN.NN>
function format(rawResponse) {
  const versionString = rawResponse.split("VERFW:").pop();
  return parseFloat(versionString);
}

module.exports = format;
