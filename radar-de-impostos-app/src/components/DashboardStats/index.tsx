import {
    DollarSign,
    Percent,
    Receipt as ReceiptIcon,
    Trophy,
} from "lucide-react";
import { CupomFiscal } from "../../models/CupomFiscal";
import { StatCard } from "../StatCard";

interface DashboardStatsProps {
    stats: {
        totalSpent: number;
        totalTaxes: number;
    } | null;
    receipts: CupomFiscal[];
}

export function DashboardStats({ stats, receipts }: DashboardStatsProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    const taxBurden =
        stats && stats.totalSpent > 0
            ? ((stats.totalTaxes / stats.totalSpent) * 100).toFixed(1)
            : "0";

    const mostExpensiveReceipt =
        receipts.length > 0
            ? receipts.reduce((prev, current) =>
                  prev.totalValue > current.totalValue ? prev : current,
              )
            : null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title="Total em Impostos este mês"
                value={formatCurrency(stats?.totalTaxes || 0)}
                change="+0%"
                isPositive={true}
                icon={DollarSign}
            />
            <StatCard
                title="Total em Gastos este mês"
                value={formatCurrency(stats?.totalSpent || 0)}
                change="+0%"
                isPositive={true}
                icon={ReceiptIcon}
            />
            <StatCard
                title="Carga Tributária"
                value={`${taxBurden}%`}
                change="0%"
                isPositive={true}
                icon={Percent}
            />
            <StatCard
                title="Nota Mais Cara deste mês"
                value={
                    mostExpensiveReceipt
                        ? formatCurrency(mostExpensiveReceipt.totalValue)
                        : "R$ 0,00"
                }
                description={
                    mostExpensiveReceipt
                        ? `${mostExpensiveReceipt.storeName} · ${mostExpensiveReceipt.formatedDate}`
                        : "Nenhum cupom salvo"
                }
                icon={Trophy}
            />
        </div>
    );
}
