export interface ExchangeRate {
  _id?: string;
  currencyPair: string;
  rate: number;
  timestamp: Date;
}
