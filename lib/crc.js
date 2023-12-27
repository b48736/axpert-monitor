module.exports = getCRCBuff;

function getCRCBuff(data) {
    var data_bytes = data.toString('ascii');
    var crc = 0;
    var da = 0;
    var crc_ta = [
        0x0000,
        0x1021,
        0x2042,
        0x3063,
        0x4084,
        0x50A5,
        0x60C6,
        0x70E7,
        0x8108,
        0x9129,
        0xA14A,
        0xB16B,
        0xC18C,
        0xD1AD,
        0xE1CE,
        0xF1EF,
    ];
    var arr = data_bytes.split('');
    for (var _i = 0; _i < arr.length; _i++) {
        var c = arr[_i];
        var byte = c.charCodeAt(0);
        da = ((crc >> 8) & 0xFF) >> 4;
        crc = (crc << 4) & 0xFFFF;
        var index = da ^ (byte >> 4);
        crc ^= crc_ta[index];
        da = ((crc >> 8) & 0xFF) >> 4;
        crc = (crc << 4) & 0xFFFF;
        index = da ^ (byte & 0x0F);
        crc ^= crc_ta[index];
    }
    var crc_low = crc & 0xFF;
    var crc_high = (crc >> 8) & 0xFF;
    if (crc_low === 0x28 || crc_low === 0x0D || crc_low === 0x0A || crc_low === 0x00) {
        crc_low += 1;
    }
    if (crc_high === 0x28 || crc_high === 0x0D || crc_high === 0x0A || crc_high === 0x00) {
        crc_high += 1;
    }
    var crcBuffer = Buffer.from(Uint8Array.from([crc_high, crc_low]));
    return crcBuffer;
}
