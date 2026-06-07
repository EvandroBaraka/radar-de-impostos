import { CupomFiscal } from "../../models/CupomFiscal";
import { Button } from "../Button";
import Loader from "../Loader";
import { ReceiptTableRow } from "./ReceiptTableRow";

interface ReceiptsTableProps {
    receipts: CupomFiscal[];
    isLoading: boolean;
    isLoadingMore: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    onViewDetails: (receipt: CupomFiscal) => void;
    onDelete: (nfeKey: string) => void;
}

export function ReceiptsTable({
    receipts,
    isLoading,
    isLoadingMore,
    hasMore,
    onLoadMore,
    onViewDetails,
    onDelete,
}: ReceiptsTableProps) {
    return (
        <div className="bg-[#0f172a]/50 border border-[#334155] rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#334155] bg-[#1e293b]/50">
                            <th className="px-6 py-4 text-xs font-semibold text-[#90a1b9] uppercase tracking-wider">
                                Data
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-[#90a1b9] uppercase tracking-wider">
                                Estabelecimento
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-[#90a1b9] uppercase tracking-wider">
                                Valor Total
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-[#90a1b9] uppercase tracking-wider">
                                Impostos
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-[#90a1b9] uppercase tracking-wider text-right">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#334155]">
                        {isLoading && receipts.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-6 py-12 text-center"
                                >
                                    <div className="flex justify-center">
                                        <Loader />
                                    </div>
                                </td>
                            </tr>
                        ) : receipts.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-6 py-12 text-center text-[#90a1b9]"
                                >
                                    Nenhum cupom encontrado.
                                </td>
                            </tr>
                        ) : (
                            receipts.map((receipt, index) => (
                                <ReceiptTableRow
                                    key={receipt.nfeKey || index}
                                    receipt={receipt}
                                    onViewDetails={onViewDetails}
                                    onDelete={onDelete}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {hasMore && receipts.length > 0 && (
                <div className="p-4 border-t border-[#334155] flex justify-center bg-[#0f172a]/30">
                    <Button
                        variant="secondary"
                        onClick={onLoadMore}
                        disabled={isLoadingMore}
                        classes="w-full sm:w-auto"
                    >
                        {isLoadingMore ? "Carregando..." : "Ver mais"}
                    </Button>
                </div>
            )}
        </div>
    );
}
