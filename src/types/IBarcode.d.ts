import ViewGroup from "@smartface/native/ui/viewgroup";

export interface IBarcodeScanner {
    /**
     * Typically, page.layout is used
     */
    layout: ViewGroup;
    width: number;
    height: number;
}
