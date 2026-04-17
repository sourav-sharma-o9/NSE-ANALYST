export interface InvestorInfo {
  name: string;
  origin: string;
  valuation: string;
  politicalConnections: string;
}

export interface StockAnalysis {
  symbol: string;
  companyName: string;
  livePrice: string;
  past: {
    majorDeals: string[];
    majorDecisions: string[];
    pastPerformance: string;
  };
  current: {
    situation: string;
    decisions: string[];
    budget: string;
    problems: string[];
  };
  future: {
    upcomingDecisions: string[];
    fundingInfo: string;
    projects: string[];
    growthChances: string;
    mainHurdles: string[];
  };
  investors: InvestorInfo[];
  buyMeterScore: number; // 0 to 100
}

export const NIFTY_50_STOCKS = [
  'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'SBIN', 'BHARTIARTL', 'ITC', 'KOTAKBANK',
  'LT', 'AXISBANK', 'ADANIENT', 'ASIANPAINT', 'MARUTI', 'SUNPHARMA', 'TITAN', 'BAJFINANCE', 'ULTRACEMCO', 'ADANIPORTS',
  'HCLTECH', 'ONGC', 'TATASTEEL', 'NTPC', 'POWERGRID', 'M&M', 'JSWSTEEL', 'GRASIM', 'COALINDIA', 'HINDALCO',
  'NESTLEIND', 'TATACONSUM', 'BRITANNIA', 'BAJAJFINSV', 'HEROMOTOCO', 'INDUSINDBK', 'SBILIFE', 'DRREDDY', 'DIVISLAB', 'BPCL',
  'EICHERMOT', 'CIPLA', 'ADANIPORTS', 'UPL', 'LTIM', 'APOLLOHOSP', 'TATAMOTORS', 'BAJAJ-AUTO', 'WIPRO', 'TECHM'
];
