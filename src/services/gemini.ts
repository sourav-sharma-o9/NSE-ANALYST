import { GoogleGenAI, Type } from "@google/genai";
import { StockAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });

export async function analyzeStock(symbol: string): Promise<StockAnalysis> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Search for and analyze the NSE listed stock: ${symbol}. 
    Provide real-time data and detailed intelligence for the following sections:
    1. LIVE PRICE: Current trading price on NSE.
    2. PAST: Major deals, decisions, and market performance.
    3. CURRENT: Situation, decisions, budget, and problems.
    4. FUTURE: Upcoming decisions, funding, projects, growth, and hurdles.
    5. INVESTORS: Details of companies who invested (Origin, valuation, political connections).
    6. BUY METER SCORE: A number from 0 to 100 based on technical indicators and performance of the stock in the last few weeks (0 = Strong Sell, 100 = Strong Buy).

    Ensure the data is as accurate and recent as possible using Google Search.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          symbol: { type: Type.STRING },
          companyName: { type: Type.STRING },
          livePrice: { type: Type.STRING },
          buyMeterScore: { type: Type.NUMBER, description: "Score from 0 to 100" },
          past: {
            type: Type.OBJECT,
            properties: {
              majorDeals: { type: Type.ARRAY, items: { type: Type.STRING } },
              majorDecisions: { type: Type.ARRAY, items: { type: Type.STRING } },
              pastPerformance: { type: Type.STRING },
            },
            required: ["majorDeals", "majorDecisions", "pastPerformance"]
          },
          current: {
            type: Type.OBJECT,
            properties: {
              situation: { type: Type.STRING },
              decisions: { type: Type.ARRAY, items: { type: Type.STRING } },
              budget: { type: Type.STRING },
              problems: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["situation", "decisions", "budget", "problems"]
          },
          future: {
            type: Type.OBJECT,
            properties: {
              upcomingDecisions: { type: Type.ARRAY, items: { type: Type.STRING } },
              fundingInfo: { type: Type.STRING },
              projects: { type: Type.ARRAY, items: { type: Type.STRING } },
              growthChances: { type: Type.STRING },
              mainHurdles: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["upcomingDecisions", "fundingInfo", "projects", "growthChances", "mainHurdles"]
          },
          investors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                origin: { type: Type.STRING },
                valuation: { type: Type.STRING },
                politicalConnections: { type: Type.STRING },
              },
              required: ["name", "origin", "valuation", "politicalConnections"]
            }
          }
        },
        required: ["symbol", "companyName", "livePrice", "past", "current", "future", "investors"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate analysis");
  }

  return JSON.parse(response.text) as StockAnalysis;
}
