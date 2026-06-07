import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useState, lazy, Suspense, useEffect, useCallback } from "react";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Percent,
    Receipt as ReceiptIcon,
    Trophy,
    QrCode,
} from "lucide-react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";
import { fetchNFCe } from "../../services/fetch-nfce";
import { saveReceipt, listReceipts, getStats } from "../../services/receipts";
import { CupomFiscal } from "../../models/CupomFiscal";
import Loader from "../../components/Loader";
import { Button } from "../../components/Button";
import { getCategoryIcon } from "../../utils/category-icons";

const Modal = lazy(() => import("../../components/Modal"));
const QrScanner = lazy(() => import("../../components/QrScanner"));

// Mock data para o gráfico enquanto a API não fornece dados históricos por mês
const chartData = [
    { name: "Dez", gastos: 2400, impostos: 400 },
    { name: "Jan", gastos: 1800, impostos: 350 },
    { name: "Fev", gastos: 2900, impostos: 550 },
    { name: "Mar", gastos: 2200, impostos: 440 },
    { name: "Abr", gastos: 3100, impostos: 620 },
    { name: "Mai", gastos: 2700, impostos: 540 },
];

export const Route = createFileRoute("/_app/dashboard")({
    beforeLoad: () => {
        if (!localStorage.getItem("token")) {
            throw redirect({ to: "/auth/login" });
        }
    },
    component: Dashboard,
});

function Dashboard() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [cupom, setCupom] = useState<CupomFiscal | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [receipts, setReceipts] = useState<CupomFiscal[]>([]);
    const [stats, setStats] = useState<{
        totalSpent: number;
        totalTaxes: number;
    } | null>(null);

    const userName = localStorage.getItem("userName");
    const token = localStorage.getItem("token");

    const loadDashboardData = useCallback(async () => {
        if (!token) return;

        try {
            const [receiptsData, statsData] = await Promise.all([
                listReceipts(token),
                getStats(token),
            ]);

            setReceipts(receiptsData);
            setStats(statsData);
        } catch (err) {
            console.error("Erro ao carregar dados da dashboard:", err);
        }
    }, [token]);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    const fetchData = async (url: string) => {
        try {
            setError(null);
            setIsLoading(true);
            setIsScannerOpen(false);

            if (!token) {
                console.error("Token não encontrado");
                return;
            }

            const data = await fetchNFCe(url, token);
            const novoCupom = new CupomFiscal(
                data.storeName || "Loja Desconhecida",
                data.cnpj || "",
                data.category || "Outros",
                data.totalValue || 0,
                data.tributes || 0,
                data.purchaseDate ? new Date(data.purchaseDate) : new Date(),
                data.nfeKey || undefined,
            );

            setCupom(novoCupom);
        } catch (err) {
            console.error(err);
            setError(
                "Erro ao buscar NFC-e. Veja o console para mais detalhes.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleScan = async (qrCodeData: string) => {
        try {
            if (qrCodeData.startsWith("http")) {
                fetchData(qrCodeData);
                setIsScannerOpen(false);
            } else {
                setError("QR Code não contém parâmetro NFC-e válido");
            }
        } catch (err) {
            setError(
                "QR Code não é uma URL válida - " + (err as Error).message,
            );
        }
    };

    const handleSave = async () => {
        if (!cupom || !token) return;

        try {
            setError(null);
            setIsLoading(true);

            await saveReceipt(cupom, token);
            setIsModalOpen(false);
            setCupom(null);

            // Recarrega os dados após salvar
            await loadDashboardData();
        } catch (err) {
            console.error(err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Erro ao salvar cupom fiscal",
            );
        } finally {
            setIsLoading(false);
        }
    };

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
        <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        Olá, {userName}{" "}
                        <span className="animate-bounce">👋</span>
                    </h1>
                    <p className="text-[#90a1b9]">
                        Aqui está o resumo dos seus impostos registrados.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setIsModalOpen(true);
                        setIsScannerOpen(true);
                    }}
                    className="group relative flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 cursor-pointer"
                >
                    <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <QrCode className="w-5 h-5 relative" />
                    <span className="relative text-lg">Escanear cupom</span>
                </button>
            </div>

            {/* Modal de Scanner */}
            <Suspense>
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Escanear Cupom Fiscal"
                >
                    {isScannerOpen ? (
                        <QrScanner
                            onScan={handleScan}
                            onError={(err) =>
                                console.error("Erro no scanner:", err)
                            }
                        />
                    ) : cupom ? (
                        <div className="flex flex-col items-center justify-center gap-3">
                            <p className="text-center">
                                <span className="font-bold">
                                    {cupom.storeName}
                                </span>
                                <br />
                                <span className="text-sm text-[#90a1b9]">
                                    Categoria: {cupom.category}
                                </span>
                                <br />
                                CNPJ: {cupom.cnpj} - {cupom.formatedDate}
                                <br />
                                Valor Total: {cupom.formatedTotalValue}
                                <br />
                                Impostos aproximados: {cupom.formatedTributes}
                                <br />
                                <span className="text-xs text-[#475569]">
                                    Chave: {cupom.nfeKey}
                                </span>
                            </p>
                            <div className="flex gap-3 items-center justify-center">
                                <Button onClick={() => setIsScannerOpen(true)}>
                                    Escanear novamente
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Salvando..." : "Salvar cupom"}
                                </Button>
                            </div>
                            {error && <p style={{ color: "red" }}>{error}</p>}
                        </div>
                    ) : isLoading ? (
                        <div className="flex flex-col items-center justify-center gap-3">
                            <Loader />
                            <p className="text-center text-[#90a1b9]">
                                Aguardando escaneamento...
                            </p>
                        </div>
                    ) : error ? (
                        <p style={{ color: "red" }}>{error}</p>
                    ) : (
                        <p>Aguardando leitura...</p>
                    )}
                </Modal>
            </Suspense>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total em Impostos"
                    value={formatCurrency(stats?.totalTaxes || 0)}
                    change="+0%"
                    isPositive={true}
                    icon={DollarSign}
                />
                <StatCard
                    title="Total em Gastos"
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
                    title="Nota Mais Cara"
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

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-[#0f172a]/50 border border-[#334155] rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold mb-6">
                        Evolução dos Gastos vs Impostos
                    </h3>
                    <div className="h-87.5 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient
                                        id="colorGastos"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#3b82f6"
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#3b82f6"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                    <linearGradient
                                        id="colorImpostos"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#ef4444"
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#ef4444"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#1e293b"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="name"
                                    stroke="#475569"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#475569"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `R$ ${value}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#0f172a",
                                        borderColor: "#334155",
                                        borderRadius: "8px",
                                        color: "#fff",
                                    }}
                                    itemStyle={{ color: "#fff" }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="gastos"
                                    name="Gastos"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorGastos)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="impostos"
                                    name="Impostos"
                                    stroke="#ef4444"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorImpostos)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Last Purchases Section */}
                <div className="bg-[#0f172a]/50 border border-[#334155] rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold mb-6">
                        Últimas Compras
                    </h3>
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
            </div>
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: string;
    change?: string;
    isPositive?: boolean;
    description?: string;
    icon: React.ElementType;
}

function StatCard({
    title,
    value,
    change,
    isPositive,
    description,
    icon: Icon,
}: StatCardProps) {
    return (
        <div className="bg-[#0f172a]/50 border border-[#334155] rounded-2xl p-6 backdrop-blur-sm hover:border-white/20 transition-colors relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <span className="text-[#90a1b9] text-sm font-medium">
                    {title}
                </span>
                <div className="p-2 rounded-lg bg-[#1e293b] text-[#90a1b9] group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                </div>
            </div>
            <div className="space-y-1">
                <h2 className="text-2xl font-bold">{value}</h2>
                {change && (
                    <div
                        className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-emerald-400" : "text-rose-400"}`}
                    >
                        {isPositive ? (
                            <TrendingUp className="w-3 h-3" />
                        ) : (
                            <TrendingDown className="w-3 h-3" />
                        )}
                        {change}
                        <span className="text-[#475569] ml-1">
                            em relação ao total
                        </span>
                    </div>
                )}
                {description && (
                    <p className="text-xs text-[#475569]">{description}</p>
                )}
            </div>
        </div>
    );
}
