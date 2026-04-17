/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, TrendingUp, TrendingDown, Clock, Target, Rocket, Users, AlertCircle, Info, ArrowRight, Loader2 } from 'lucide-react';
import { analyzeStock } from './services/gemini.ts';
import { StockAnalysis, NIFTY_50_STOCKS } from './types.ts';

const NIFTY_100_STOCKS = [
  ...NIFTY_50_STOCKS,
  'ZOMATO', 'HAL', 'BEL', 'DLF', 'VBL', 'TRENT', 'SIEMENS', 'ABB', 'IRFC', 'GAIL'
];

const BuyMeter = ({ score }: { score: number }) => {
  // Map 0-100 to -90 to 90 degrees
  const rotation = (score / 100) * 180 - 90;
  
  const getLabel = () => {
    if (score < 20) return { text: 'Strong Sell', color: 'text-red-500' };
    if (score < 40) return { text: 'Sell', color: 'text-red-400' };
    if (score < 60) return { text: 'Neutral', color: 'text-yellow-500' };
    if (score < 80) return { text: 'Buy', color: 'text-green-400' };
    return { text: 'Strong Buy', color: 'text-green-500' };
  };

  const label = getLabel();

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-16 md:w-48 md:h-24 overflow-hidden mb-2">
        {/* Semi-circle track with accurate color segments */}
        <div 
          className="absolute inset-0 rounded-t-full"
          style={{
            background: 'conic-gradient(from 0deg at 50% 100%, #ef4444 0deg, #ef4444 60deg, #f59e0b 60deg, #f59e0b 120deg, #10b981 120deg, #10b981 180deg, transparent 180deg)',
            transform: 'rotate(-90deg)',
            opacity: 0.25
          }}
        />
        
        {/* Border track overlay */}
        <div className="absolute inset-0 border-[4px] md:border-[10px] border-border-dim/20 rounded-t-full" />

        {/* Needle */}
        <motion.div 
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 1.5, type: 'spring', bounce: 0.3 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 md:w-1 h-12 md:h-20 bg-accent-white origin-bottom z-20"
        >
          <div className="absolute top-0 left-[-2px] md:left-[-3px] w-2 md:w-2.5 h-2 md:h-2.5 bg-accent-white rounded-full shadow-lg" />
        </motion.div>

        {/* Needle base center */}
        <div className="absolute bottom-[-4px] md:bottom-[-6px] left-1/2 -translate-x-1/2 w-3 md:w-5 h-3 md:h-5 bg-surface border-2 border-accent-white rounded-full z-30 shadow-xl" />
      </div>
      <div className="flex flex-col items-center">
        <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] ${label.color}`}>
          {label.text}
        </span>
        <span className="text-[10px] md:text-[14px] font-mono font-bold text-accent-white mt-0.5">
          {score}% Intel
        </span>
      </div>
    </div>
  );
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<StockAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'NIFTY50' | 'NIFTY100'>('NIFTY50');

  const handleSearch = async (symbol: string) => {
    if (!symbol) return;
    setAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeStock(symbol);
      setAnalysis(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch stock intelligence. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text-main font-sans selection:bg-accent-blue/30 p-6 md:p-8 flex flex-col gap-6 max-w-[1200px] mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-center pb-5 border-b border-border-dim gap-4">
        <div className="text-xl font-bold tracking-widest uppercase">
          NSE Analyst <span className="text-accent-blue">PRO</span>
        </div>
        
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim w-4 h-4" />
          <input
            type="text"
            placeholder="Search Stocks (e.g. RELIANCE, TATA, HDFC)..."
            className="w-full bg-surface border border-border-dim rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-accent-blue/50 transition-all placeholder:text-text-dim/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
          />
        </div>

        <div className="text-xs text-text-dim flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Live Data • Market Open
        </div>
      </header>

      <div className="flex gap-6 bg-[#111113] p-3 px-5 rounded overflow-x-auto border border-border-dim/30">
        <div className="flex items-center gap-2 text-[13px] whitespace-nowrap">
          <span className="text-text-dim uppercase tracking-tighter">NIFTY 50</span>
          <span className="font-semibold">22,147.50</span>
          <span className="text-green-500 text-xs">+0.82%</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] whitespace-nowrap border-l border-border-dim/50 pl-6">
          <span className="text-text-dim uppercase tracking-tighter">NIFTY 100</span>
          <span className="font-semibold">22,482.15</span>
          <span className="text-green-500 text-xs">+0.75%</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] whitespace-nowrap border-l border-border-dim/50 pl-6">
          <span className="text-text-dim uppercase tracking-tighter">BANK NIFTY</span>
          <span className="font-semibold">46,919.00</span>
          <span className="text-green-500 text-xs">+1.12%</span>
        </div>
      </div>

      <main className="flex-grow">
        {!analysis && !analyzing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex gap-2 mb-6">
              <button 
                onClick={() => setActiveTab('NIFTY50')}
                className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded transition-all ${activeTab === 'NIFTY50' ? 'bg-accent-blue text-white' : 'bg-surface text-text-dim hover:text-text-main border border-border-dim'}`}
              >
                NIFTY 50
              </button>
              <button 
                onClick={() => setActiveTab('NIFTY100')}
                className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded transition-all ${activeTab === 'NIFTY100' ? 'bg-accent-blue text-white' : 'bg-surface text-text-dim hover:text-text-main border border-border-dim'}`}
              >
                NIFTY 100
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {(activeTab === 'NIFTY50' ? NIFTY_50_STOCKS : NIFTY_100_STOCKS).map((symbol) => (
                <button
                  key={symbol}
                  onClick={() => handleSearch(symbol)}
                  className="p-4 bg-surface border border-border-dim rounded hover:border-accent-blue/50 transition-all text-left group"
                >
                  <span className="block font-bold text-sm tracking-wide group-hover:text-accent-blue">{symbol}</span>
                  <span className="text-[10px] text-text-dim group-hover:text-text-dim/80">Analysis Available</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {analyzing && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-10 h-10 text-accent-blue animate-spin" />
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-text-dim">Synthesizing Market Intel</p>
          </div>
        )
        }

        {error && (
          <div className="p-4 bg-accent-red/10 border border-accent-red/20 rounded-lg text-accent-red text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {analysis && !analyzing && (
            <motion.div
              key={analysis.symbol}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-center md:items-end border-b border-border-dim pb-6 gap-6">
                <div className="text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-accent-white">{analysis.companyName}</h1>
                  <p className="text-text-dim text-sm mt-1 uppercase tracking-widest font-medium">NSE: {analysis.symbol} | Market Analysis</p>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                  <div className="text-4xl md:text-5xl font-light text-accent-white flex items-baseline gap-3">
                    {analysis.livePrice}
                    <span className="text-xs md:text-base text-green-500 font-semibold tracking-tighter">▲ LIVE</span>
                  </div>
                  <div className="border-t md:border-t-0 md:border-l border-border-dim/30 pt-4 md:pt-0 md:pl-8 w-full md:w-auto flex justify-center">
                    <BuyMeter score={analysis.buyMeterScore} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row items-stretch lg:h-[420px]">
                {/* PAST - BOX PAST */}
                <div className="flex-1 bg-accent-red/5 border border-accent-red p-7 rounded-t-xl lg:rounded-tr-none lg:rounded-l-xl flex flex-col gap-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent-red/80">Past Performance</h3>
                  <div className="space-y-6">
                    <div>
                      <span className="text-[11px] uppercase text-text-dim block mb-1">Major Deals</span>
                      <p className="text-sm leading-relaxed">{analysis.past.majorDeals.join(", ")}.</p>
                    </div>
                    <div>
                      <span className="text-[11px] uppercase text-text-dim block mb-1">Strategic Decisions</span>
                      <p className="text-sm leading-relaxed">{analysis.past.majorDecisions.join(", ")}.</p>
                    </div>
                    <div className="mt-auto pt-4 border-t border-accent-red/20 italic text-sm text-text-main/80">
                      {analysis.past.pastPerformance}
                    </div>
                  </div>
                </div>

                {/* PRESENT - BOX PRESENT */}
                <div className="flex-1 bg-accent-white text-black p-7 z-10 shadow-[0_0_40px_rgba(255,255,255,0.08)] flex flex-col gap-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] opacity-70">Current Situation</h3>
                  <div className="space-y-6">
                    <div>
                      <span className="text-[11px] uppercase opacity-50 font-bold block mb-1">Status Overview</span>
                      <p className="text-sm font-bold leading-relaxed">{analysis.current.situation}</p>
                    </div>
                    <div>
                      <span className="text-[11px] uppercase opacity-50 font-bold block mb-1">Active Budget</span>
                      <p className="text-sm">{analysis.current.budget}</p>
                    </div>
                    <div>
                      <span className="text-[11px] uppercase opacity-50 font-bold block mb-1">Critical Problems</span>
                      <ul className="space-y-1">
                        {analysis.current.problems.map((p, i) => (
                          <li key={i} className="text-xs flex items-start gap-2">
                            <span className="mt-1.5 w-1 h-1 bg-black rounded-full shrink-0" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* FUTURE - BOX FUTURE */}
                <div className="flex-1 bg-accent-blue/5 border border-accent-blue p-7 rounded-b-xl lg:rounded-bl-none lg:rounded-r-xl flex flex-col gap-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent-blue/80">Future Forecast</h3>
                  <div className="space-y-6">
                    <div>
                      <span className="text-[11px] uppercase text-text-dim block mb-1">Upcoming Decisions</span>
                      <p className="text-sm leading-relaxed">{analysis.future.upcomingDecisions.join(", ")}.</p>
                    </div>
                    <div>
                      <span className="text-[11px] uppercase text-text-dim block mb-1">Growth Pipeline</span>
                      <p className="text-sm leading-relaxed">{analysis.future.growthChances}</p>
                    </div>
                    <div>
                      <span className="text-[11px] uppercase text-text-dim block mb-1">Key Hurdles</span>
                      <p className="text-xs text-text-dim/80">{analysis.future.mainHurdles.join(" | ")}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* INVESTOR STRIP */}
              <div className="bg-surface border border-border-dim rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {analysis.investors.slice(0, 4).map((investor, i) => (
                  <div key={i} className="flex flex-col gap-1 pr-4 border-r border-border-dim/30 last:border-r-0">
                    <span className="text-[10px] uppercase text-text-dim font-bold tracking-wider">Primary Stakeholder</span>
                    <span className="text-sm font-semibold truncate">{investor.name}</span>
                    <div className="flex gap-2 mt-2">
                      <span className="bg-white/10 text-[10px] px-2 py-0.5 rounded text-text-main">{investor.origin}</span>
                      <span className="bg-accent-blue/20 text-[10px] px-2 py-0.5 rounded text-accent-blue font-bold tracking-tighter">VAL: {investor.valuation}</span>
                    </div>
                    <p className="text-[11px] text-text-dim mt-3 leading-relaxed border-t border-border-dim/20 pt-2 italic">
                      {investor.politicalConnections}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-4">
                <button 
                  onClick={() => { setAnalysis(null); setSearchQuery(''); }}
                  className="text-[10px] uppercase tracking-[0.3em] font-black text-text-dim hover:text-accent-white transition-colors py-4 px-8 border border-border-dim rounded hover:border-accent-white/20"
                >
                  Return to Global Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-8 pt-8 border-t border-border-dim flex justify-between items-center text-[10px] uppercase tracking-widest text-text-dim/50 font-bold">
        <span>Google AI Studio Environment</span>
        <span>Market Intelligence Node: {new Date().toLocaleDateString()}</span>
      </footer>
    </div>
  );
}
