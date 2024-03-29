import AndroidConfig from "@smartface/native/util/Android/androidconfig";
import View from "@smartface/native/ui/view";
import ViewGroup from "@smartface/native/ui/viewgroup";
import { EventEmitter } from "@smartface/native/core/eventemitter";
import { IBarcodeScanner } from "types/IBarcode";

enum BarcodeFormat {
    AZTEC = 'AZTEC',
    CODABAR = 'CODABAR',
    CODE_39 = 'CODE_39',
    CODE_93 = 'CODE_93',
    CODE_128 = 'CODE_128',
    DATA_MATRIX = 'DATA_MATRIX',
    EAN_8 = 'EAN_8',
    EAN_13 = 'EAN_13',
    ITF = 'ITF',
    MAXICODE = 'MAXICODE',
    PDF_417 = 'PDF_417',
    QR_CODE = 'QR_CODE',
    RSS_14 = 'RSS_14',
    RSS_EXPANDED = 'RSS_EXPANDED',
    UPC_A = 'UPC_A',
    UPC_E = 'UPC_E',
    UPC_EAN_EXTENSION = 'UPC_EAN_EXTENSION'
}

export class BarcodeScanner extends EventEmitter implements IBarcodeScanner {
    static Events = {
        Result: "result"
    };
    _scannerView?: View;
    _width: number = 0;
    _height: number = 0;
    _layout: ViewGroup;
    applyOrientationParentView = () => {}
    cameraStarted = false;

    constructor(params: IBarcodeScanner) {
        super();
        if (!params.layout) {
            throw new Error("layout parameter is required");
        }
        this._layout = params.layout;
    }
    width: number = 0;
    height: number = 0;

    get layout(): ViewGroup {
        return this._layout;
    }

    set layout(value: ViewGroup) {
        this._layout = value;
    }

    startCamera = () => {
        //@ts-ignore
        this._scannerView.nativeObject.startCamera();
    }

    show = () => {
        //@ts-ignore
        const ZXingScannerView = requireClass(
            "me.dm7.barcodescanner.zxing.ZXingScannerView"
        );
        this._scannerView = new View({ flexGrow: 1 });
        //@ts-ignore
        this._scannerView.nativeObject = new ZXingScannerView(
            AndroidConfig.activity
        );
        let resultHandler = ZXingScannerView.ResultHandler.implement({
            handleResult: (rawResult: any) => {
                this.emit(BarcodeScanner.Events.Result, [{
                    barcode: {
                        text: rawResult.getText(),
                        format: rawResult.getBarcodeFormat().toString()
                    }
                }])
            },
        });
        //@ts-ignore
        this._scannerView.nativeObject.setResultHandler(resultHandler);
        //@ts-ignore
        this._scannerView.nativeObject.resumeCameraPreview(resultHandler);
        this.layout.addChild(this._scannerView);
    }

    hide = () => {
        this.layout.removeAll();
    }

    stopCamera = () => {
        //@ts-ignore
        this._scannerView.nativeObject.stopCamera();
    }

    toString = () => "BarcodeScanner";

    static Format = BarcodeFormat;
    static ios = {};
}

