export interface AuthRequest {
    email: string;
    password: string;
}

export interface RegisterRequest extends AuthRequest {
    name?: string;
}

export interface Receipt {
    id: string;
    storeName?: string;
    cnpj: number;
    totalValue: number;
    tributes: number;
    purchaseDate: Date;
    nfeKey: number;
}