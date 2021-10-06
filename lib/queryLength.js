const queryLength = {
  QPI: 8,
  QID: 16,
  QVFW: 18,
  QVFW2: 19,
  QPIRI: 101,
  QFLAGS: 15,
  QPIGS: 110,
  QMOD: 5,
  QPIWS: 36,
  QDI: 83,
  QMCHGCR: 35,
  QMUCHGCR: 39,
  QBOOT: 7, // NAK?
  QOPM: 6, // CRC missmatch. shifted by 4 bits?
  QPGS0: 133,
  QPGS1: 133,
  QPGS2: 133,
  QPGS3: 133,
  QPGS4: 133,
  QPGS5: 133,
  QPGS6: 133,
  QPGS7: 133,
  QPGS8: 133,
};



module.exports = queryLength;
