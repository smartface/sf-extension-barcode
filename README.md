# sf-extension-barcode
[![Twitter: @Smartface_io](https://img.shields.io/badge/contact-@Smartface_io-blue.svg?style=flat)](https://twitter.com/smartface_io)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://raw.githubusercontent.com/smartface/sf-extension-barcode/master/LICENSE)
## Installation
Smartface Barcode Extension can be installed via npm easily from our public npm repository. Execute this command on your scripts directory:
```shell
npm i @smartface/extension-barcode
```
## How to use
- Import extension with
```javascript
import { BarcodeScanner } from "@smartface/extension-barcode";
```
- Create an instance of `BarcodeScanner`. Result will be handled in `onResult` callback.
```javascript
const barcodeScanner = new BarcodeScanner({
    layout: myFlexLayout, // Required
    width: 200, // Required
    height: 200, // Required
    onResult: ({ barcode }) => {
        let { text, format } = barcode;
        alert(text);
        barcodeScanner.stopCamera();
        barcodeScanner.hide();
    }
});
```
- Finally call `show` method with no parameters. Camera [permissions](#permissions) must be granted before running `show` method.
```javascript
barcodeScanner.show();
```

## Barcode Format Type
Supported Formats: 
```javascript
Barcode.FormatType.AZTEC
Barcode.FormatType.CODABAR
Barcode.FormatType.CODE_39
Barcode.FormatType.CODE_93
Barcode.FormatType.CODE_128
Barcode.FormatType.DATA_MATRIX
Barcode.FormatType.EAN_8
Barcode.FormatType.EAN_13
Barcode.FormatType.ITF
Barcode.FormatType.MAXICODE
Barcode.FormatType.PDF_417
Barcode.FormatType.QR_CODE
Barcode.FormatType.RSS_14
Barcode.FormatType.RSS_EXPANDED
Barcode.FormatType.UPC_A
Barcode.FormatType.UPC_E
Barcode.FormatType.UPC_EAN_EXTENSION
```    

Barcode format can be retrieved like this.
```javascript
import { BarcodeScanner } from "@smartface/extension-barcode";
barcodeScanner.onResult = ({ barcode }) => {
    if (barcode.format === BarcodeScanner.Format.QR_CODE) {
        console.log("This is a qr code");
    }
};
```    
## Notes
- If there is a need for closing the scanner, it needs to be implemented by the developer. For Android [onBackButtonPressed](http://ref.smartface.io/#!/api/UI.Page-event-onBackButtonPressed) needs to be implemented.
- Scanner does not hide automatically when scanned
- A scanner instance can be used only for once per image scan. For each scan action, a new `BarcodeScanner` instance should be created and used
- For Android, if there is an active textbox (keyboard is visible), developer needs to close the keyboard before showing the scanner.
- It is advised to call `show` method with a timeout value for rendering performance.

## Permissions
 For iOS, you have to add camera permission to Info.plist.
```xml
<key>NSCameraUsageDescription</key>
<string>${PRODUCT_NAME} Camera Usage</string>
```
For Android, you have to add camera permission to AndroidManifest.xml.
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" />
<uses-feature android:name="android.hardware.camera.autofocus" />
```
## Sample
There are some examples in [sample](./sample) folder. You can use them.
## Credits
This barcode library is based on:
- [Android](https://github.com/dm77/barcodescanner) implementation
- [iOS](https://github.com/TheLevelUp/ZXingObjC) implementation
## Need Help?
Please [submit an issue](https://github.com/smartface/sf-extension-barcode/issues) on GitHub and provide information about your problem.
## Support & Documentation & Useful Links
- [Smartface Cloud Dashboard](https://cloud.smartface.io)
## Code of Conduct
We are committed to making participation in this project a harassment-free experience for everyone, regardless of the level of experience, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.
Please read and follow our [Code of Conduct](https://github.com/smartface/sf-extension-barcode/blob/master/CODE_OF_CONDUCT.md).
## License
This project is licensed under the terms of the MIT license. See the [LICENSE](https://raw.githubusercontent.com/smartface/sf-extension-barcode/master/LICENSE) file. Within the scope of this license, all modifications to the source code, regardless of the fact that it is used commercially or not, shall be committed as a contribution back to this repository.
