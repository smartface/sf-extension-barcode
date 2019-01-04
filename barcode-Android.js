/* globals requireClass */
const Barcode = require("./Barcode");
const AndroidConfig = require('sf-core/util/Android/androidconfig');
const View = require("sf-core/ui/view");

function BarcodeScanner(params) {
    if (!params.page)
        throw new Error("page parameter is required");

    Object.defineProperties(this, {
        onResult: {
            get: () => this._onResult,
            set: e => this._onResult = e,
            enumerable: true
        },
        layout: {
            get: () => this.page.layout,
            enumerable: true
        },
        startCamera: {
            value: () => {
                this._scannerView.nativeObject.startCamera();
            },
            enumerable: true,
            configurable: true
        },
        show: {
            value: () => {
                const ZXingScannerView = requireClass("me.dm7.barcodescanner.zxing.ZXingScannerView");
                this._scannerView = new View({ flexGrow: 1 });
                this._scannerView.nativeObject = new ZXingScannerView(AndroidConfig.activity);
                let resultHandler = ZXingScannerView.ResultHandler.implement({
                    handleResult: rawResult => {
                        this._onResult && this._onResult({
                            barcode: new Barcode({
                                text: rawResult.getText(),
                                format: rawResult.getBarcodeFormat().toString()
                            })
                        });
                    }
                });
                this._scannerView.nativeObject.setResultHandler(resultHandler);
                this._scannerView.nativeObject.resumeCameraPreview(resultHandler);
                this.page.layout.addChild(this._scannerView);
            },
            enumerable: true,
            configurable: true
        },
        hide: {
            value: () => {
                this.layout.removeAll();
            },
            enumerable: true,
            configurable: true
        },
        stopCamera: {
            value: () => {
                this._scannerView.nativeObject.stopCamera();
            },
            enumerable: true,
            configurable: true
        },
        toString: {
            value: () => "BarcodeScanner",
            enumerable: true,
            configurable: true
        }
    });

    if (params) {
        for (let param in params) {
            this[param] = params[param];
        }
    }
}

module.exports = {
    Barcode,
    BarcodeScanner
};
