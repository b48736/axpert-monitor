const MODES = {
  "00": "Single",
  "01": "Parallel",
  "02": "Phase 1 of 3",
  "03": "Phase 2 of 3",
  "04": "Phase 3 of 3",
};

function format(rawResponse) {
  return MODES[rawResponse];
}

module.exports = format;
