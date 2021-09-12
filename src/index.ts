// const System = require("@smartface/native/device/system");
// module.exports = require(`./barcode-${System.OS}`);

import System from "@smartface/native/device/system";
import type * as BarcodeAndroid from './barcode-Android';
import type * as BarcodeIOS from './barcode-iOS';

const Barcode: typeof BarcodeAndroid & typeof BarcodeIOS = require(`./Barcode-${System.OS}`);

export = Barcode;