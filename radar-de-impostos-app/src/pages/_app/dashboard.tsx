import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState, lazy, Suspense, useEffect, useCallback } from "react";
import { QrCode } from "lucide-react";
import { fetchNFCe } from "../../services/fetch-nfce";
import { saveReceipt, listReceipts, getStats } from "../../services/receipts";
import { CupomFiscal } from "../../models/CupomFiscal";
import Loader from "../../components/Loader";
import { ReceiptForm, type ReceiptFormData } from "../../components/ReceiptForm";
import { DashboardStats } from "../../components/DashboardStats";
import { OverviewChart } from "../../components/OverviewChart";
import { RecentPurchases } from "../../components/RecentPurchases";

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
            setCupom(null);
            setError(null);

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

    const onSave = async (data: ReceiptFormData) => {
        if (!token) return;

        try {
            setError(null);
            setIsLoading(true);

            const cupomParaSalvar = new CupomFiscal(
                data.storeName,
                data.cnpj,
                data.category,
                data.totalValue,
                data.tributes,
                new Date(data.purchaseDate),
                data.nfeKey,
            );

            await saveReceipt(cupomParaSalvar, token);
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
                        <ReceiptForm
                            initialData={cupom}
                            onSubmit={onSave}
                            onCancel={() => setIsScannerOpen(true)}
                            isLoading={isLoading}
                        />
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
            <DashboardStats stats={stats} receipts={receipts} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Section */}
                <OverviewChart data={chartData} />

                {/* Last Purchases Section */}
                <RecentPurchases receipts={receipts} />
            </div>
        </div>
    );
}
