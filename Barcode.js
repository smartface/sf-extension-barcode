const System = require("@smartface/native/device/system");
var isIOS = System.OS === "iOS";

function Barcode(params) {
  Object.defineProperties(this, {
    format: {
      get: () => this._format,
      set: (e) => (this._format = e),
      enumerable: true,
    },
    text: {
      get: () => this._text,
      set: (e) => (this._text = e),
      enumerable: true,
    },
  });

  if (params) {
    for (var param in params) {
      this[param] = params[param];
    }
  }
}

Object.defineProperty(Barcode, "FormatType", {
  value: {},
  enumerable: true,
});

Object.defineProperties(Barcode.FormatType, {
  AZTEC: {
    value: isIOS ? 0 : "AZTEC",
    enumerable: true,
  },
  CODABAR: {
    value: isIOS ? 1 : "CODABAR",
    enumerable: true,
  },
  CODE_39: {
    value: isIOS ? 2 : "CODE_39",
    enumerable: true,
  },
  CODE_93: {
    value: isIOS ? 3 : "CODE_93",
    enumerable: true,
  },
  CODE_128: {
    value: isIOS ? 4 : "CODE_128",
    enumerable: true,
  },
  DATA_MATRIX: {
    value: isIOS ? 5 : "DATA_MATRIX",
    enumerable: true,
  },
  EAN_8: {
    value: isIOS ? 6 : "EAN_8",
    enumerable: true,
  },
  EAN_13: {
    value: isIOS ? 7 : "EAN_13",
    enumerable: true,
  },
  ITF: {
    value: isIOS ? 8 : "ITF",
    enumerable: true,
  },
  MAXICODE: {
    value: isIOS ? 9 : "MAXICODE",
    enumerable: true,
  },
  PDF_417: {
    value: isIOS ? 10 : "PDF_417",
    enumerable: true,
  },
  QR_CODE: {
    value: isIOS ? 11 : "QR_CODE",
    enumerable: true,
  },
  RSS_14: {
    value: isIOS ? 12 : "RSS_14",
    enumerable: true,
  },
  RSS_EXPANDED: {
    value: isIOS ? 13 : "RSS_EXPANDED",
    enumerable: true,
  },
  UPC_A: {
    value: isIOS ? 14 : "UPC_A",
    enumerable: true,
  },
  UPC_E: {
    value: isIOS ? 15 : "UPC_E",
    enumerable: true,
  },
  UPC_EAN_EXTENSION: {
    value: isIOS ? 16 : "UPC_EAN_EXTENSION",
    enumerable: true,
  },
});

module.exports = Barcode;
