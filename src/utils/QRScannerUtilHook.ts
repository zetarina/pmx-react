import { useRef, useEffect, useCallback } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export const useQrScanner = (
  onNewScanResult: (decodedText: string) => void,
  scannerDivId: string
) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const isUnmountingRef = useRef(false);

  const initializeScanner = useCallback(() => {
    if (!scannerRef.current && document.getElementById(scannerDivId)) {
      const config = {
        rememberLastUsedCamera: true,
        fps: 10,
        qrbox: 250,
        disableFlip: false,
      };
      scannerRef.current = new Html5QrcodeScanner(scannerDivId, config, false);
      scannerRef.current.render(onNewScanResult, (errorMessage) => {
        const ignoredErrors = [
          "QR code parse error, error = NotFoundException: No MultiFormat Readers were able to detect the code.",
          "QR code parse error, error = FormatException: Could not decode QR Code",
        ];
        if (!ignoredErrors.includes(errorMessage)) {
          console.error(`QR Code error: ${errorMessage}`);
        }
      });
    }
  }, [onNewScanResult, scannerDivId]);

  useEffect(() => {
    isUnmountingRef.current = false;
    initializeScanner();

    return () => {
      isUnmountingRef.current = true;
      if (scannerRef.current) {
        scannerRef.current
          .clear()
          .catch((err) => console.error("Failed to clear scanner", err));
      }
    };
  }, [initializeScanner]);

  return { scannerRef, isUnmountingRef };
};
