import React from 'react';
import { Check } from 'lucide-react';

const PricingCard = ({ tier, price, period, features, recommended, onDownload }) => (
  <div className={`relative p-8 rounded-3xl border flex flex-col h-full transition-all duration-300 ${recommended ? 'bg-slate-900 dark:bg-blue-600 text-white border-slate-900 dark:border-blue-600 ring-4 ring-blue-500/20 dark:ring-blue-900/40 shadow-xl' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'}`}>
    {recommended && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 dark:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">Most Popular</div>}
    <div className="mb-8">
      <h3 className={`text-lg font-bold mb-2 ${recommended ? 'text-blue-200 dark:text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>{tier}</h3>
      <div className="flex items-baseline gap-1"><span className="text-4xl font-extrabold">{price}</span>{period && <span className={`text-sm ${recommended ? 'text-slate-400 dark:text-blue-200' : 'text-slate-500 dark:text-slate-500'}`}>{period}</span>}</div>
      <p className={`mt-4 text-sm ${recommended ? 'text-slate-400 dark:text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>Perfect for {tier.toLowerCase()} users.</p>
    </div>
    <ul className="space-y-4 mb-8 flex-grow">{features.map((feature, i) => (<li key={i} className="flex items-start gap-3 text-sm"><Check size={18} className={`shrink-0 ${recommended ? 'text-blue-400 dark:text-white' : 'text-green-600 dark:text-green-400'}`} /><span className={recommended ? 'text-slate-200 dark:text-blue-50' : 'text-slate-700 dark:text-slate-300'}>{feature}</span></li>))}</ul>
    <button onClick={onDownload} className={`w-full py-3 rounded-xl font-bold transition-all ${recommended ? 'bg-blue-600 dark:bg-white hover:bg-blue-700 dark:hover:bg-slate-100 text-white dark:text-blue-600 shadow-lg shadow-blue-900/50' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white'}`}>{recommended ? 'Install App' : 'Get Started'}</button>
  </div>
);

export default PricingCard;
