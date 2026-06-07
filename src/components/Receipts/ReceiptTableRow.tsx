import { Eye, Trash2 } from "lucide-react";
import { CupomFiscal } from "../../models/CupomFiscal";
import { getCategoryIcon } from "../../utils/category-icons";

interface ReceiptTableRowProps {
    receipt: CupomFiscal;
    onViewDetails: (receipt: CupomFiscal) => void;
    onDelete: (nfeKey: string) => void;
}

export function ReceiptTableRow({
    receipt,
    onViewDetails,
    onDelete,
}: ReceiptTableRowProps) {
    const Icon = getCategoryIcon(receipt.category);

    return (
        <tr className="hover:bg-[#1e293b]/30 transition-colors group">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#90a1b9]">
                {receipt.formatedDate}
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 shrink-0 rounded-lg bg-[#1e293b] flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#90a1b9]" />
                    </div>
                    <div className="max-w-37.5 sm:max-w-50 md:max-w-xs truncate">
                        <p className="text-sm font-medium text-white truncate">
                            {receipt.storeName}
                        </p>
                        <p className="text-xs text-[#475569]">
                            {receipt.category}
                        </p>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                {receipt.formatedTotalValue}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-400">
                {receipt.formatedTributes}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => onViewDetails(receipt)}
                        className="p-2 rounded-lg bg-[#1e293b] text-[#90a1b9] hover:text-white hover:bg-[#334155] transition-all"
                        title="Ver detalhes"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(receipt.nfeKey || "")}
                        className="p-2 rounded-lg bg-[#1e293b] text-[#90a1b9] hover:text-rose-400 hover:bg-[#334155] transition-all"
                        title="Excluir cupom"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}
