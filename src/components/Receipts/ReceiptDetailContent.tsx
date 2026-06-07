import { CupomFiscal } from "../../models/CupomFiscal";
import { getCategoryIcon } from "../../utils/category-icons";
import { Button } from "../Button";

interface ReceiptDetailContentProps {
    receipt: CupomFiscal;
    onDelete: (nfeKey: string) => void;
    onClose: () => void;
}

export function ReceiptDetailContent({
    receipt,
    onDelete,
    onClose,
}: ReceiptDetailContentProps) {
    const Icon = getCategoryIcon(receipt.category);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                    <p className="text-[10px] text-[#90a1b9] uppercase font-bold tracking-wider">
                        Estabelecimento
                    </p>
                    <p className="text-white font-medium text-lg leading-tight">
                        {receipt.storeName}
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] text-[#90a1b9] uppercase font-bold tracking-wider">
                        Categoria
                    </p>
                    <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[#90a1b9]" />
                        <p className="text-white font-medium">
                            {receipt.category}
                        </p>
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] text-[#90a1b9] uppercase font-bold tracking-wider">
                        Data da Compra
                    </p>
                    <p className="text-white font-medium">
                        {receipt.formatedDate}
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] text-[#90a1b9] uppercase font-bold tracking-wider">
                        CNPJ
                    </p>
                    <p className="text-white font-medium">{receipt.cnpj}</p>
                </div>
                <div className="space-y-1 bg-[#1e293b]/30 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-[#90a1b9] uppercase font-bold tracking-wider">
                        Valor Total
                    </p>
                    <p className="text-white font-bold text-xl">
                        {receipt.formatedTotalValue}
                    </p>
                </div>
                <div className="space-y-1 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                    <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
                        Impostos Estimados
                    </p>
                    <p className="text-emerald-400 font-bold text-xl">
                        {receipt.formatedTributes}
                    </p>
                </div>
            </div>

            <div className="pt-4 border-t border-[#334155]">
                <p className="text-[10px] text-[#90a1b9] uppercase font-bold tracking-wider mb-2">
                    Chave de Acesso (NFC-e)
                </p>
                <div className="bg-[#020618] p-3 rounded-xl border border-white/5">
                    <p className="text-xs text-[#475569] break-all font-mono leading-relaxed select-all">
                        {receipt.nfeKey}
                    </p>
                </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
                <Button variant="secondary" onClick={onClose} classes="!px-6">
                    Fechar
                </Button>
                <Button
                    variant="primary"
                    onClick={() => onDelete(receipt.nfeKey || "")}
                    classes="!bg-rose-500 hover:!bg-rose-600 !text-white !px-6 border-none"
                >
                    Excluir Cupom
                </Button>
            </div>
        </div>
    );
}
