import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { listReceipts, deleteReceipt } from "../../services/receipts";
import { CupomFiscal } from "../../models/CupomFiscal";
import { HistoryHeader } from "../../components/Receipts/HistoryHeader";
import { ReceiptsTable } from "../../components/Receipts/ReceiptsTable";
import { ReceiptDetailContent } from "../../components/Receipts/ReceiptDetailContent";

const Modal = lazy(() => import("../../components/Modal"));

export const Route = createFileRoute("/_app/history")({
    beforeLoad: () => {
        if (!localStorage.getItem("token")) {
            throw redirect({ to: "/auth/login" });
        }
    },
    component: History,
});

function History() {
    const [receipts, setReceipts] = useState<CupomFiscal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const [selectedReceipt, setSelectedReceipt] = useState<CupomFiscal | null>(
        null,
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const token = localStorage.getItem("token") || "";
    const LIMIT = 10;

    const loadReceipts = useCallback(
        async (currentOffset: number, clear = false) => {
            try {
                if (currentOffset === 0) {
                    setIsLoading(true);
                } else {
                    setIsLoadingMore(true);
                }

                const data = await listReceipts(token, LIMIT, currentOffset);

                if (clear) {
                    setReceipts(data);
                    setOffset(0);
                    setHasMore(data.length === LIMIT);
                } else {
                    setReceipts((prev) => {
                        // Evita duplicados comparando nfeKey
                        const existingKeys = new Set(prev.map((r) => r.nfeKey));
                        const newItems = data.filter(
                            (r) => !existingKeys.has(r.nfeKey),
                        );
                        return [...prev, ...newItems];
                    });

                    if (data.length < LIMIT) {
                        setHasMore(false);
                    }
                }
            } catch (err) {
                console.error("Erro ao carregar histórico:", err);
                setError("Não foi possível carregar o histórico de cupons.");
            } finally {
                setIsLoading(false);
                setIsLoadingMore(false);
            }
        },
        [token],
    );

    useEffect(() => {
        loadReceipts(0, true);
    }, [loadReceipts]);

    const handleLoadMore = () => {
        const nextOffset = offset + LIMIT;
        setOffset(nextOffset);
        loadReceipts(nextOffset);
    };

    const handleDelete = async (nfeKey: string) => {
        if (!confirm("Tem certeza que deseja excluir este cupom?")) return;

        try {
            await deleteReceipt(nfeKey, token);
            setReceipts((prev) => prev.filter((r) => r.nfeKey !== nfeKey));
            alert("Cupom excluído com sucesso!");
            setIsModalOpen(false);
        } catch (err) {
            console.error("Erro ao excluir cupom:", err);
            alert("Erro ao excluir cupom.");
        }
    };

    const handleViewDetails = (receipt: CupomFiscal) => {
        setSelectedReceipt(receipt);
        setIsModalOpen(true);
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
            <HistoryHeader />

            {error && (
                <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-xl text-red-200">
                    {error}
                </div>
            )}

            <ReceiptsTable
                receipts={receipts}
                isLoading={isLoading}
                isLoadingMore={isLoadingMore}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                onViewDetails={handleViewDetails}
                onDelete={handleDelete}
            />

            <Suspense>
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Detalhes do Cupom"
                >
                    {selectedReceipt && (
                        <ReceiptDetailContent
                            receipt={selectedReceipt}
                            onDelete={handleDelete}
                            onClose={() => setIsModalOpen(false)}
                        />
                    )}
                </Modal>
            </Suspense>
        </div>
    );
}
