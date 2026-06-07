export class CupomFiscal {
  constructor(
    public storeName: string,
    public cnpj: string,
    public category: string,
    public totalValue: number,
    public tributes: number,
    public purchaseDate: Date,
    public nfeKey?: string,
  ) {}

  get formatedTotalValue(): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(this.totalValue);
  }

  get formatedTributes(): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(this.tributes);
  }
  
  get formatedDate(): string {
    return this.purchaseDate.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  }
}
