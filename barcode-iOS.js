/* globals SF, __SF_Dispatch */
const Invocation = require("@smartface/native/util").Invocation;
const Screen = require("@smartface/native/device/screen");
const Barcode = require("./Barcode");

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

function BarcodeScanner(params) {
  if (!params.layout) throw new Error("layout parameter is required");
  if (!params.width) throw new Error("width parameter is required");
  if (!params.height) throw new Error("height parameter is required");

  Object.defineProperties(this, {
    onResult: {
      get: () => this._onResult,
      set: (e) => (this._onResult = e),
      enumerable: true,
    },
    width: {
      get: () => this._width,
      set: (e) => (this._width = e),
      enumerable: true,
    },
    height: {
      get: () => this._height,
      set: (e) => (this._height = e),
      enumerable: true,
    },
    layout: {
      get: () => this._layout,
      set: (layout) => (this._layout = layout),
      enumerable: true,
    },
    startCamera: {
      value: () => {
        this.cameraStarted = true;
        Invocation.invokeInstanceMethod(this.layout.capture, "start", []);
      },
      enumerable: true,
      configurable: true,
    },
    show: {
      value: () => {
        let layout = this.layout;
        let alloc = Invocation.invokeClassMethod(
          "ZXCapture",
          "alloc",
          [],
          "id"
        );
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
          layout.capture,
          "setCaptureFramesPerSec:",
          [argCaptureFramesPerSec]
        );
        layout.captureLayer = Invocation.invokeInstanceMethod(
          layout.capture,
          "layer",
          [],
          "NSObject"
        );

        let argCaptureLayer = new Invocation.Argument({
          type: "NSObject",
          value: layout.captureLayer,
        });
        let argSublayerIndex = new Invocation.Argument({
          type: "NSUInteger",
          value: 0,
        });
        Invocation.invokeInstanceMethod(
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
        Invocation.invokeInstanceMethod(layout.captureLayer, "setFrame:", [
          argCaptureFrame,
        ]);

        let argCaptureBack = new Invocation.Argument({
          type: "NSInteger",
          value: Invocation.invokeInstanceMethod(
            layout.capture,
            "back",
            [],
            "NSInteger"
          ),
        });
        Invocation.invokeInstanceMethod(layout.capture, "setCamera:", [
          argCaptureBack,
        ]);

        let argFocusMode = new Invocation.Argument({
          type: "NSInteger",
          value: AVCaptureFocusMode.ContinuousAutoFocus,
        });
        Invocation.invokeInstanceMethod(layout.capture, "setFocusMode:", [
          argFocusMode,
        ]);

        let CaptureDelegate = SF.defineClass(
          "CaptureDelegate : NSObject <ZXCaptureDelegate>",
          {
            captureResultResult: (capture, result) => {
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
            captureCameraIsReady: function (capture) {},
            captureSizeWidthHeight: function (capture, width, height) {},
          }
        );

        layout.captureDelegate = CaptureDelegate.new();
        let argCaptureDelegate = new Invocation.Argument({
          type: "NSObject",
          value: layout.captureDelegate,
        });
        Invocation.invokeInstanceMethod(layout.capture, "setDelegate:", [
          argCaptureDelegate,
        ]);
        this.applyOrientationParentView();
        this.cameraStarted = true;
      },
      enumerable: true,
      configurable: true,
    },
    hide: {
      value: () => {
        this.layout.captureLayer &&
          this.layout.captureLayer.removeFromSuperlayer();
        this.layout.captureLayer = undefined;
        this.layout.captureDelegate = undefined;
        this.layout.capture = undefined;
        this.layout = undefined;
      },
      enumerable: true,
      configurable: true,
    },
    stopCamera: {
      value: () => {
        this.cameraStarted = false;
        Invocation.invokeInstanceMethod(this.layout.capture, "hard_stop", []);
      },
      enumerable: true,
      configurable: true,
    },
    toString: {
      value: () => "BarcodeScanner",
      enumerable: true,
      configurable: true,
    },
    applyOrientationParentView: {
      value: () => {
        let argCapture = new Invocation.Argument({
          type: "NSObject",
          value: this.layout.capture,
        });
        Invocation.invokeClassMethod("ZXingObjcHelper", "applyOrientation:", [
          argCapture,
        ]);
      },
    },
  });

  if (params) {
    for (let param in params) {
      this[param] = params[param];
    }
  }
}

Object.defineProperty(BarcodeScanner, "Format", {
  value: Barcode.FormatType,
  enumerable: true,
});

BarcodeScanner.ios = {};
BarcodeScanner.ios.checkPermission = (e) => {
  let onSuccess = typeof e.onSuccess === "function" ? e.onSuccess : () => {};
  let onFailure = typeof e.onFailure === "function" ? e.onFailure : () => {};
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
      value: (granted) => {
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
};

module.exports = {
  BarcodeScanner,
};
