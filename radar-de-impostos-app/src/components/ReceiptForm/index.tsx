import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { CupomFiscal } from "../../models/CupomFiscal";
import { Button } from "../Button";
import { categoryIcons } from "../../utils/category-icons";

const receiptSchema = z
    .object({
        storeName: z.string().min(1, "Nome da loja é obrigatório"),
        cnpj: z
            .string()
            .length(14, { message: "O CNPJ deve conter 14 digitos" })
            .regex(/^\d+$/, "O CNPJ deve conter apenas números"),
        category: z.string().min(1, "Categoria é obrigatória"),
        totalValue: z
            .number("Campo obrigatório")
            .positive("O valor total deve ser maior que zero"),
        tributes: z
            .number("Campo obrigatório")
            .positive("O valor de impostos deve ser maior que zero"),
        purchaseDate: z.string().min(1, "Data é obrigatória"),
        nfeKey: z
            .string()
            .length(44, { message: "A chave NFC-e deve conter 44 caracteres" })
            .regex(/^\d+$/, "A chave NFC-e deve conter apenas números"),
    })
    .refine((data) => data.tributes <= data.totalValue, {
        message: "O valor do imposto não pode ser maior que o valor total",
        path: ["tributes"],
    });

export type ReceiptFormData = z.infer<typeof receiptSchema>;

interface ReceiptFormProps {
    initialData: CupomFiscal;
    onSubmit: (data: ReceiptFormData) => Promise<void>;
    onCancel: () => void;
    isLoading: boolean;
}

export function ReceiptForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading,
}: ReceiptFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<ReceiptFormData>({
        mode: "onBlur",
        criteriaMode: "all",
        resolver: zodResolver(receiptSchema),
    });

    // eslint-disable-next-line react-hooks/incompatible-library
    const watchedTotalValue = watch("totalValue");
    const watchedTributes = watch("tributes");
    const isHighTax = watchedTributes > watchedTotalValue * 0.5;

    useEffect(() => {
        if (initialData) {
            reset({
                storeName: initialData.storeName,
                cnpj: initialData.cnpj,
                category: initialData.category,
                totalValue: initialData.totalValue,
                tributes: initialData.tributes,
                purchaseDate: initialData.purchaseDate
                    .toISOString()
                    .split("T")[0],
                nfeKey: initialData.nfeKey,
            });
        }
    }, [initialData, reset]);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[#90a1b9] uppercase tracking-wider">
                        Loja
                    </label>
                    <input
                        {...register("storeName")}
                        className="bg-[#1e293b] border border-[#334155] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-[#475569]"
                    />
                    {errors.storeName && (
                        <span className="text-[10px] text-rose-500 font-medium">
                            {errors.storeName.message}
                        </span>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[#90a1b9] uppercase tracking-wider">
                        Categoria
                    </label>
                    <select
                        {...register("category")}
                        className="bg-[#1e293b] border border-[#334155] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                    >
                        {Object.keys(categoryIcons).map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    {errors.category && (
                        <span className="text-[10px] text-rose-500 font-medium">
                            {errors.category.message}
                        </span>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[#90a1b9] uppercase tracking-wider">
                        CNPJ
                    </label>
                    <input
                        type="number"
                        {...register("cnpj")}
                        className="bg-[#1e293b] border border-[#334155] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-[#475569] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    {errors.cnpj && (
                        <span className="text-[10px] text-rose-500 font-medium">
                            {errors.cnpj.message}
                        </span>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[#90a1b9] uppercase tracking-wider">
                        Data da Compra
                    </label>
                    <input
                        type="date"
                        {...register("purchaseDate")}
                        className="bg-[#1e293b] border border-[#334155] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors scheme-dark"
                    />
                    {errors.purchaseDate && (
                        <span className="text-[10px] text-rose-500 font-medium">
                            {errors.purchaseDate.message}
                        </span>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[#90a1b9] uppercase tracking-wider">
                        Valor Total (R$)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        {...register("totalValue", {
                            valueAsNumber: true,
                        })}
                        className="bg-[#1e293b] border border-[#334155] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-[#475569] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    {errors.totalValue && (
                        <span className="text-[10px] text-rose-500 font-medium">
                            {errors.totalValue.message}
                        </span>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[#90a1b9] uppercase tracking-wider">
                        Impostos (R$)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        {...register("tributes", {
                            valueAsNumber: true,
                        })}
                        className={`bg-[#1e293b] border ${isHighTax ? "border-amber-500/50" : "border-[#334155]"} rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-[#475569] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                    />
                    {isHighTax && !errors.tributes && (
                        <span className="text-[10px] text-amber-500 font-medium animate-in fade-in duration-300">
                            ⚠️ Impostos acima de 50% do total da compra.
                            Verifique se os valores estão corretos.
                        </span>
                    )}
                    {errors.tributes && (
                        <span className="text-[10px] text-rose-500 font-medium">
                            {errors.tributes.message}
                        </span>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-[#90a1b9] uppercase tracking-wider">
                    Chave NFC-e
                </label>
                <input
                    type="number"
                    {...register("nfeKey")}
                    className="bg-[#1e293b] border border-[#334155] rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors placeholder-[#475569] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                {errors.nfeKey && (
                    <span className="text-[10px] text-rose-500 font-medium">
                        {errors.nfeKey.message}
                    </span>
                )}
            </div>

            <div className="flex gap-3 items-center justify-center pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Escanear novamente
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar cupom"}
                </Button>
            </div>
        </form>
    );
}
