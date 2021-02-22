import ViewGroup = require('sf-core/ui/viewgroup');

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
    UPC_EAN_EXTENSION
}

interface IBarcodeScanner {
    onResult?: (options?: { barcode?: { text: string, format: BarcodeFormat } }) => void;
    /**
     * Typically, page.layout is used
     */
    layout: ViewGroup;
    width: number;
    height: number;
}
declare class BarcodeScanner implements IBarcodeScanner {
    constructor(params: IBarcodeScanner);
    startCamera(): void;
    /**
     * Permissions must be granted to use this function. 
     * Refer to permission util to request permission
     */
    show(): void;
    hide(): void;
    stopCamera(): void;
    static Format: typeof BarcodeFormat;
    static ios: {
        checkPermission(params?: {
            onSuccess: () => void,
            onFailure: () => void
        }): void;
    }
}