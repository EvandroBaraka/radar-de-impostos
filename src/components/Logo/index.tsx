import receiptIcon from "../../assets/receipt-icon.svg";

export const Logo = () => {
    return (
        <div className="flex items-center gap-4">
            <img
                src={receiptIcon}
                alt="Ícone de Recibo"
                className="bg-white w-10 h-10 rounded-xl p-1.5"
            />
            <h1 className="text-xl font-bold">Radar de Impostos</h1>
        </div>
    );
};
