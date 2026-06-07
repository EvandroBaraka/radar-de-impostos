import { Scanner } from "@yudiel/react-qr-scanner";

interface ScannerProps {
    onScan: (result: string) => void;
    onError?: (error: string) => void;
}

const QrScanner = ({ onScan, onError }: ScannerProps) => {
    const handleScan = (detectedCodes: Array<{ rawValue: string }>) => {
        if (detectedCodes.length === 0) {
            onError?.("Nenhum código detectado");
            return;
        }
        onScan(detectedCodes[0].rawValue);
    };

    const handleError = (error: unknown) => {
        let message = "Erro desconhecido no scanner";
        if (error instanceof Error) {
            if (error.name === "NotAllowedError") {
                message =
                    "Acesso à câmera negado. Permita o acesso nas configurações do navegador.";
            } else if (error.name === "NotFoundError") {
                message = "Nenhuma câmera encontrada no dispositivo.";
            } else if (error.name === "NotReadableError") {
                message = "A câmera está sendo usada por outro app.";
            } else {
                message = error.message;
            }
        }
        console.error("QR Scanner error:", error);
        if (onError) {
            onError(message);
        }
    };

    return (
        <div className="max-w-125 m-auto">
            <h2>Escaneie o QR Code da NFC-e</h2>
                <Scanner
                    onScan={handleScan}
                    onError={handleError}
                    components={{
                        torch: true, // Show torch/flashlight button (if supported)
                        zoom: true, // Show zoom control (if supported)
                    }}
                    scanDelay={350}
                    constraints={{
                        facingMode: { ideal: "environment" }, // Prefere traseira, mas permite frontal
                    }}
                    styles={{
                        container: {
                            width: "100%",
                            maxWidth: "400px",
                            margin: "0 auto",
                        },
                        video: {
                            width: "100%",
                            height: "auto",
                            borderRadius: "8px",
                        },
                    }}
                />
        </div>
    );
};

export default  QrScanner;