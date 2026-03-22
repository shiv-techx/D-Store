import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Currency = 'USD' | 'INR' | 'GBP' | 'EUR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (priceInUSD: number) => number;
  formatPrice: (priceInUSD: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  INR: '₹',
  GBP: '£',
  EUR: '€',
};

// Default exchange rates as fallback
const DEFAULT_RATES: Record<string, number> = {
  USD: 1,
  INR: 83.0,
  GBP: 0.79,
  EUR: 0.92,
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('USD');
  const [rates, setRates] = useState<Record<string, number>>(DEFAULT_RATES);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('user_currency', newCurrency);
  };

  useEffect(() => {
    const initCurrency = async () => {
      // 1. Fetch exchange rates
      try {
        const cachedRates = localStorage.getItem('exchange_rates');
        const cachedRatesTime = localStorage.getItem('exchange_rates_time');
        const now = Date.now();
        
        if (cachedRates && cachedRatesTime && now - parseInt(cachedRatesTime) < 24 * 60 * 60 * 1000) {
          setRates(JSON.parse(cachedRates));
        } else {
          const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
          if (res.ok) {
            const data = await res.json();
            setRates(data.rates);
            localStorage.setItem('exchange_rates', JSON.stringify(data.rates));
            localStorage.setItem('exchange_rates_time', now.toString());
          }
        }
      } catch (error) {
        console.error('Failed to fetch exchange rates', error);
      }

      // 2. Detect user currency if not set
      const savedCurrency = localStorage.getItem('user_currency') as Currency;
      if (savedCurrency && CURRENCY_SYMBOLS[savedCurrency]) {
        setCurrencyState(savedCurrency);
      } else {
        try {
          const res = await fetch('https://ipapi.co/json/');
          if (res.ok) {
            const data = await res.json();
            const countryCurrency = data.currency;
            if (countryCurrency === 'INR' || countryCurrency === 'GBP' || countryCurrency === 'EUR' || countryCurrency === 'USD') {
              setCurrencyState(countryCurrency as Currency);
              localStorage.setItem('user_currency', countryCurrency);
            } else if (['AT', 'BE', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES'].includes(data.country_code)) {
              setCurrencyState('EUR');
              localStorage.setItem('user_currency', 'EUR');
            } else {
              setCurrencyState('USD');
              localStorage.setItem('user_currency', 'USD');
            }
          } else {
            throw new Error('IP API failed');
          }
        } catch (error) {
          console.error('Failed to detect location, falling back to browser language', error);
          // Fallback to browser language
          const lang = navigator.language;
          if (lang.includes('en-IN') || lang.includes('hi')) setCurrencyState('INR');
          else if (lang.includes('en-GB')) setCurrencyState('GBP');
          else if (lang.includes('de') || lang.includes('fr') || lang.includes('it') || lang.includes('es')) setCurrencyState('EUR');
          else setCurrencyState('USD');
        }
      }
    };

    initCurrency();
  }, []);

  const convertPrice = (priceInUSD: number) => {
    const rate = rates[currency] || DEFAULT_RATES[currency] || 1;
    return priceInUSD * rate;
  };

  const formatPrice = (priceInUSD: number) => {
    const converted = convertPrice(priceInUSD);
    const symbol = CURRENCY_SYMBOLS[currency] || '$';
    
    // Format without decimals if it's a whole number or for INR
    if (currency === 'INR') {
      return `${symbol}${Math.round(converted).toLocaleString('en-IN')}`;
    }
    
    return `${symbol}${converted.toFixed(2).replace(/\.00$/, '')}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
