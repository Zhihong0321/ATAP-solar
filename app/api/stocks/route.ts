import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance({
  suppressNotices: ['yahooSurvey']
});

// Bursa Renewable Energy Stocks
const TICKERS = [
  '0215.KL', // Solarvest
  '0223.KL', // Samaiden
  '5184.KL', // Cypark
  '0233.KL', // Pekat
  '0262.KL', // Sunview
  '3069.KL', // Mega First
  '0132.KL', // Kinergy Advancement (KAB)
  '0168.KL', // BM Greentech
];

// Mapping tickers to cleaner names if needed (Yahoo names can be verbose)
const NAME_MAP: Record<string, string> = {
  '0215.KL': 'Solarvest',
  '0223.KL': 'Samaiden',
  '5184.KL': 'Cypark',
  '0233.KL': 'Pekat',
  '0262.KL': 'Sunview',
  '3069.KL': 'Mega First',
  '0132.KL': 'KAB',
  '0168.KL': 'BM Greentech',
};

// Simple in-memory cache
let cache: {
  data: any;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export async function GET() {
  try {
    // Check cache
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return NextResponse.json(cache.data);
    }

    const quotes = await yahooFinance.quote(TICKERS);
    
    // Ensure quotes is an array before mapping
    const quotesArray = Array.isArray(quotes) ? quotes : [quotes];

    const data = quotesArray.map((quote: any) => ({
      symbol: quote.symbol,
      name: NAME_MAP[quote.symbol] || quote.shortName || quote.symbol,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
    }));

    // Update cache
    cache = {
      data,
      timestamp: Date.now(),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}
