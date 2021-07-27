import ViewGroup from "@smartface/native/ui/viewgroup";

declare enum BarcodeFormat {
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

declare type TOnResult = (options?: {
  barcode?: { text: string; format: BarcodeFormat };
}) => void;
declare interface IBarcodeScanner {
  onResult?: TOnResult;
  /**
   * Typically, page.layout is used
   */
  layout: ViewGroup;
  width: number;
  height: number;
}

export class BarcodeScanner {
  constructor(params: IBarcodeScanner);
  onResult?: TOnResult;
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
      onSuccess: () => void;
      onFailure: () => void;
    }): void;
  };
}
