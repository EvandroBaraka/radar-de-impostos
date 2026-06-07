import React from "react";
import {
    ShoppingBag,
    Utensils,
    Pill,
    Cross,
    Fuel,
    Shirt,
    MonitorSmartphone,
    Bus,
    Receipt as ReceiptIcon,
} from "lucide-react";

export const categoryIcons: { [key: string]: React.ElementType } = {
    Mercado: ShoppingBag,
    Farmácia: Pill,
    Restaurante: Utensils,
    Combustível: Fuel,
    Vestuário: Shirt,
    Eletrônicos: MonitorSmartphone,
    Saúde: Cross,
    Transporte: Bus,
    Outros: ReceiptIcon,
};

export const getCategoryIcon = (category: string) => {
    return categoryIcons[category] || ReceiptIcon;
};
