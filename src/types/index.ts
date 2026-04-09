export type Period = '6m' | '1y' | '3y';

export type Currency = 'USD' | 'JPY' | 'EUR';

export interface DataPoint {
  date: string;
  value: number;
}

export interface InterestRateData {
  current: number;
  previous: number;
  change: number;
  updatedAt: string;
  history: DataPoint[];
}

export interface ExchangeRateData {
  currency: Currency;
  current: number;
  previous: number;
  change: number;
  changeRate: number;
  high: number;
  low: number;
  average: number;
  updatedAt: string;
  history: DataPoint[];
}

export interface CpiData {
  current: number;
  previous: number;
  change: number;
  updatedAt: string;
  history: DataPoint[];
}

export interface SummaryCardProps {
  tag: string;
  value: string;
  unit: string;
  change: number;
  changeLabel: string;
  updatedAt: string;
  href: string;
  isLoading?: boolean;
  error?: string | null;
}

export interface ChartProps {
  data: DataPoint[];
  color?: string;
  unit?: string;
  isLoading?: boolean;
  height?: number;
}

export interface EcosRow {
  STAT_NAME: string;
  STAT_CODE: string;
  ITEM_CODE1: string;
  ITEM_NAME1: string;
  DATA_VALUE: string;
  TIME: string;
}

export interface KosisRow {
  ORG_ID: string;
  TBL_ID: string;
  TBL_NM: string;
  OBJ_ID: string;
  OBJ_NM: string;
  ITM_ID: string;
  ITM_NM: string;
  PRD_SE: string;
  PRD_DE: string;
  DT: string;
}
