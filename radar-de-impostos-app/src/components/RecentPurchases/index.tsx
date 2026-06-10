import { Link } from "@tanstack/react-router";
import { CupomFiscal } from "../../models/CupomFiscal";
import { getCategoryIcon } from "../../utils/category-icons";

interface RecentPurchasesProps {
    receipts: CupomFiscal[];
}

export function RecentPurchases({ receipts }: RecentPurchasesProps) {
    return (
        <div className="bg-[#0f172a]/50 border border-[#334155] rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-6">Últimas Compras</h3>
            <div className="space-y-6">
                {receipts.length === 0 ? (
                    <p className="text-[#90a1b9] text-center py-8">
                        Nenhum cupom registrado ainda.
                    </p>
                ) : (
                    receipts.slice(0, 5).map((receipt, index) => {
                        const Icon = getCategoryIcon(receipt.category);
                        return (
                            <div
                                key={receipt.nfeKey || index}
                                className="flex items-center justify-between group cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 shrink-0 rounded-lg bg-[#1e293b] flex items-center justify-center group-hover:bg-[#334155] transition-colors">
                                        <Icon className="w-5 h-5 text-[#90a1b9]" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium group-hover:text-blue-400 transition-colors">
                                            {receipt.storeName}
                                        </h4>
                                        <p className="text-xs text-[#475569]">
                                            {receipt.formatedDate}
                                        </p>
                                    </div>
                                </div>
                                <span className="font-semibold text-sm">
                                    {receipt.formatedTotalValue}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
            {receipts.length > 5 && (
                <Link
                    to="/history"
                    className="block w-full mt-8 py-2 text-sm text-center text-[#90a1b9] hover:text-white transition-colors border-t border-[#1e293b]"
                >
                    Ver histórico completo
                </Link>
            )}
        </div>
    );
}
