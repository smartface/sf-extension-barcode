import Barcode from "./Barcode";
import AndroidConfig from "@smartface/native/util/Android/androidconfig";
import View from "@smartface/native/ui/view";
import Page from "@smartface/native/ui/page";
import ViewGroup from "@smartface/native/ui/viewgroup";

type TOnResult = (options?: {
    barcode?: { text: string; format: string };
}) => void;

interface IBarcodeScanner {
    onResult?: TOnResult;
    /**
     * Typically, page.layout is used
     */
    layout: ViewGroup;
    width: number;
    height: number;
}

export class BarcodeScanner {
    private _scannerView?: View;
    private _onResult?: TOnResult;
    private _layout: ViewGroup;

    constructor(params: IBarcodeScanner) {
        if (!params.layout) {
            throw new Error("layout parameter is required");
        }
        this._layout = params.layout;
        this._onResult = params.onResult;
    }

    get onResult() {
        return this._onResult;
    }

    set onResult(value) {
        this._onResult = value;
    }

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
              this._onResult &&
                this._onResult({
                  barcode: new Barcode({
                    text: rawResult.getText(),
                    format: rawResult.getBarcodeFormat().toString(),
                  }),
                });
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
    
    static Format = Barcode.FormatType;
    static ios = {};
}
