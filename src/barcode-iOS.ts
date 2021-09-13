 
/* globals SF, __SF_Dispatch */
const { Invocation } = require("@smartface/native/util");
import ViewGroup from "@smartface/native/ui/viewgroup";
import { EventEmitter } from "@smartface/native/core/eventemitter";
import { IBarcodeScanner } from "types/IBarcode";

enum BarcodeFormat {
    AZTEC,
    CODABAR,
    CODE_39,
    CODE_93,
    CODE_128,
    DATA_MATRIX,
    EAN_8,
    EAN_13,
    ITF,
    MAXICODE,
    PDF_417,
    QR_CODE,
    RSS_14,
    RSS_EXPANDED,
    UPC_A,
    UPC_E,
    UPC_EAN_EXTENSION,
}

const AVCaptureFocusMode = {
    Locked: 0,
    AutoFocus: 1,
    ContinuousAutoFocus: 2,
};

const AVAuthorizationStatus = {
    NotDetermined: 0,
    Restricted: 1,
    Denied: 2,
    Authorized: 3,
};

export class BarcodeScanner extends EventEmitter implements IBarcodeScanner {
    static Events = {
        Result: "result"
    }
    _width: number;
    _height: number;
    _layout: ViewGroup;
    cameraStarted = false;

    constructor(params: IBarcodeScanner) {
        super();
        if (!params.layout) throw new Error("layout parameter is required");
        if (!params.width) throw new Error("width parameter is required");
        if (!params.height) throw new Error("height parameter is required");
        this._layout = params.layout;
        this._width = params.width;
        this._height = params.height;
    }

    get layout() {
        return this._layout;
    }

    set layout(value) {
        this._layout = value;
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }

    startCamera = () => {
        this.cameraStarted = true;
        //@ts-ignore
        Invocation.invokeInstanceMethod(this.layout.capture, "start", []);
    }

    show = () => {
        let layout = this.layout;
        let alloc = Invocation.invokeClassMethod(
            "ZXCapture",
            "alloc",
            [],
            "id"
        );
        //@ts-ignore
        layout.capture = Invocation.invokeInstanceMethod(
            alloc,
            "init",
            [],
            "id"
        );
        let argCaptureFramesPerSec = new Invocation.Argument({
            type: "CGFloat",
            value: 100,
        });
        Invocation.invokeInstanceMethod(
            //@ts-ignore
            layout.capture,
            "setCaptureFramesPerSec:",
            [argCaptureFramesPerSec]
        );
        //@ts-ignore
        layout.captureLayer = Invocation.invokeInstanceMethod(
            //@ts-ignore
            layout.capture,
            "layer",
            [],
            "NSObject"
        );

        let argCaptureLayer = new Invocation.Argument({
            type: "NSObject",
            //@ts-ignore
            value: layout.captureLayer,
        });
        let argSublayerIndex = new Invocation.Argument({
            type: "NSUInteger",
            value: 0,
        });
        Invocation.invokeInstanceMethod(
            //@ts-ignore
            layout.nativeObject.layer,
            "insertSublayer:atIndex:",
            [argCaptureLayer, argSublayerIndex]
        );

        let argCaptureFrame = new Invocation.Argument({
            type: "CGRect",
            value: {
                x: 0,
                y: 0,
                width: this.width,
                height: this.height,
            },
        });
        //@ts-ignore
        Invocation.invokeInstanceMethod(layout.captureLayer, "setFrame:", [
            argCaptureFrame,
        ]);

        let argCaptureBack = new Invocation.Argument({
            type: "NSInteger",
            value: Invocation.invokeInstanceMethod(
                //@ts-ignore
                layout.capture,
                "back",
                [],
                "NSInteger"
            ),
        });
        //@ts-ignore
        Invocation.invokeInstanceMethod(layout.capture, "setCamera:", [
            argCaptureBack,
        ]);

        let argFocusMode = new Invocation.Argument({
            type: "NSInteger",
            value: AVCaptureFocusMode.ContinuousAutoFocus,
        });
        //@ts-ignore
        Invocation.invokeInstanceMethod(layout.capture, "setFocusMode:", [
            argFocusMode,
        ]);
        //@ts-ignore
        let CaptureDelegate = SF.defineClass(
            "CaptureDelegate : NSObject <ZXCaptureDelegate>",
            {
                captureResultResult: (capture: any, result: any) => {
                    if (!this.cameraStarted) {
                        return;
                    }
                    let text = Invocation.invokeInstanceMethod(
                        result,
                        "text",
                        [],
                        "NSString"
                    );
                    let format = Invocation.invokeInstanceMethod(
                        result,
                        "barcodeFormat",
                        [],
                        "int"
                    );
                    this.emit(BarcodeScanner.Events.Result, [{
                        barcode: {
                            text,
                            format
                        }
                    }])
                },
                captureCameraIsReady: function (capture: any) { },
                captureSizeWidthHeight: function (capture: any, width: number, height: number) { },
            }
        );
        //@ts-ignore
        layout.captureDelegate = CaptureDelegate.new();
        let argCaptureDelegate = new Invocation.Argument({
            type: "NSObject",
            //@ts-ignore
            value: layout.captureDelegate,
        });
        //@ts-ignore
        Invocation.invokeInstanceMethod(layout.capture, "setDelegate:", [
            argCaptureDelegate,
        ]);
        this.applyOrientationParentView();
        this.cameraStarted = true;
    }

    hide = () => {
        //@ts-ignore
        this.layout.captureLayer &&
            //@ts-ignore
            this.layout.captureLayer.removeFromSuperlayer();
        //@ts-ignore
        this.layout.captureLayer = undefined;
        //@ts-ignore
        this.layout.captureDelegate = undefined;
        //@ts-ignore
        this.layout.capture = undefined;
        //@ts-ignore
        this.layout = undefined;
    }

    stopCamera = () => {
        this.cameraStarted = false;
        //@ts-ignore
        Invocation.invokeInstanceMethod(this.layout.capture, "hard_stop", []);
    }

    toString = () => "BarcodeScanner";

    applyOrientationParentView = () => {
        let argCapture = new Invocation.Argument({
            type: "NSObject",
            //@ts-ignore
            value: this.layout.capture,
        });
        Invocation.invokeClassMethod("ZXingObjcHelper", "applyOrientation:", [
            argCapture,
        ]);
    }

    static Format = BarcodeFormat;
    static ios = {
        checkPermission(): Promise<void> {
            return new Promise((resolve, reject) => {
                let argMediaType = new Invocation.Argument({
                    type: "NSString",
                    value: "vide",
                });
                let authStatus = Invocation.invokeClassMethod(
                    "AVCaptureDevice",
                    "authorizationStatusForMediaType:",
                    [argMediaType],
                    "NSInteger"
                );
                if (authStatus == AVAuthorizationStatus.Authorized) {
                    resolve();
                } else if (authStatus == AVAuthorizationStatus.Denied) {
                    reject();
                } else if (authStatus == AVAuthorizationStatus.Restricted) {
                    reject();
                } else if (authStatus == AVAuthorizationStatus.NotDetermined) {
                    let argCompHandler = new Invocation.Argument({
                        type: "BoolBlock",
                        value: (granted: any) => {
                            //@ts-ignore
                            __SF_Dispatch.mainAsync(() => (granted ? resolve() : reject()));
                        },
                    });
                    Invocation.invokeClassMethod(
                        "AVCaptureDevice",
                        "requestAccessForMediaType:completionHandler:",
                        [argMediaType, argCompHandler]
                    );
                } else {
                    reject();
                }
            })
        }
    }
}
