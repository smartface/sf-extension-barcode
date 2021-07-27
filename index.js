const System = require("@smartface/native/device/system");
module.exports = require(`./barcode-${System.OS}`);
