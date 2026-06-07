import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export function HistoryHeader() {
    return (
        <div className="flex items-center gap-4">
            <Link
                to="/dashboard"
                className="p-2 rounded-lg bg-[#1e293b] text-[#90a1b9] hover:text-white transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
                <h1 className="text-3xl font-bold">Histórico de Cupons</h1>
                <p className="text-[#90a1b9]">
                    Veja todos os seus gastos e impostos registrados.
                </p>
            </div>
        </div>
    );
}
