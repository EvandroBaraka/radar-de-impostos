import { X } from "lucide-react";
import { useEffect } from "react";
import type { ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-[#020617]/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="relative w-full max-w-xl bg-[#0f172a] border border-[#334155] rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-300 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#1e293b]">
                    <h3 className="text-lg font-semibold text-white">
                        {title || "Escaneando QR Code"}
                    </h3>
                    <button 
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-[#1e293b] text-[#90a1b9] hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[80vh]">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;