/* globals SF, __SF_Dispatch */
const Invocation = require("@smartface/native/util").Invocation;
import Screen from "@smartface/native/device/screen";
import ViewGroup from "@smartface/native/ui/viewgroup";
import Barcode from "./Barcode";

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


export class BarcodeScanner implements IBarcodeScanner {
    _onResult?: TOnResult;
    _width: number;
    _height: number;
    _layout: ViewGroup;
    cameraStarted = false;

    constructor(params: IBarcodeScanner) {
        if (!params.layout) throw new Error("layout parameter is required");
        if (!params.width) throw new Error("width parameter is required");
        if (!params.height) throw new Error("height parameter is required");
        this._layout = params.layout;
        this._width = params.width;
        this._height = params.height;
    }

    get onResult() {
        return this._onResult;
    }

    set onResult(value) {
        this._onResult = value;
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
                    this.onResult &&
                        this.onResult({
                            barcode: new Barcode({
                                text,
                                format,
                            }),
                        });
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

    static Format = Barcode.FormatType;
    static ios = {
        checkPermission(params?: {
            onSuccess: () => void;
            onFailure: () => void;
        }): void {
            let onSuccess = typeof params?.onSuccess === "function" ? params?.onSuccess : () => { };
            let onFailure = typeof params?.onFailure === "function" ? params?.onFailure : () => { };
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
                onSuccess();
            } else if (authStatus == AVAuthorizationStatus.Denied) {
                onFailure();
            } else if (authStatus == AVAuthorizationStatus.Restricted) {
                onFailure();
            } else if (authStatus == AVAuthorizationStatus.NotDetermined) {
                let argCompHandler = new Invocation.Argument({
                    type: "BoolBlock",
                    value: (granted: any) => {
                        //@ts-ignore
                        __SF_Dispatch.mainAsync(() => (granted ? onSuccess() : onFailure()));
                    },
                });
                Invocation.invokeClassMethod(
                    "AVCaptureDevice",
                    "requestAccessForMediaType:completionHandler:",
                    [argMediaType, argCompHandler]
                );
            } else {
                onFailure();
            }
        }
    }
}