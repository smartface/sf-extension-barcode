import System from "@smartface/native/device/system";

const isIOS = System.OS === System.OSType.IOS;
interface IBarcode {
    text: string;
    format: string;
}

let BarcodeFormat = {
    AZTEC: isIOS ? 0 : 'AZTEC',
    CODABAR: isIOS ? 1 : 'CODABAR',
    CODE_39: isIOS ? 1 : 'CODE_39',
    CODE_93: isIOS ? 1 : 'CODE_93',
    CODE_128: isIOS ? 1 : 'CODE_128',
    DATA_MATRIX: isIOS ? 1 : 'DATA_MATRIX',
    EAN_8: isIOS ? 1 : 'EAN_8',
    EAN_13: isIOS ? 1 : 'EAN_13',
    ITF: isIOS ? 1 : 'ITF',
    MAXICODE: isIOS ? 1 : 'MAXICODE',
    PDF_417: isIOS ? 1 : 'PDF_417',
    QR_CODE: isIOS ? 1 : 'QR_CODE',
    RSS_14: isIOS ? 1 : 'RSS_14',
    RSS_EXPANDED: isIOS ? 1 : 'RSS_EXPANDED',
    UPC_A: isIOS ? 1 : 'UPC_A',
    UPC_E: isIOS ? 1 : 'UPC_E',
    UPC_EAN_EXTENSION: isIOS ? 1 : 'UPC_EAN_EXTENSION'
}



export default class Barcode {
    private _format: string;
    private _text: string
    constructor(params: IBarcode) {
        this._format = params.format;
        this._text = params.text;
    }

    get format(): string {
        return this._format;
    }

    set format(value: string) {
        this._format = value;
    }

    get text(): string {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
    }
    static FormatType = BarcodeFormat;
}
