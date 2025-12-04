import { Check } from "lucide-react";
import React from "react";

const PricingCard = ({
  tier,
  price,
  period,
  features,
  recommended,
  onDownload,
}) => (
  <div
    className={`relative p-8 rounded-3xl border flex flex-col h-full transition-all duration-300 ${
      recommended
        ? "bg-slate-900 dark:bg-blue-600 text-white border-slate-900 dark:border-blue-600 shadow-2xl scale-105 z-10"
        : "bg-[#d5d5d5] dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-xl"
    }`}
  >
    {recommended && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
        Most Popular
      </div>
    )}
    <div className="mb-8">
      <h3
        className={`text-lg font-bold mb-2 ${
          recommended
            ? "text-blue-200 dark:text-blue-100"
            : "text-slate-500 dark:text-slate-400"
        }`}
      >
        {tier}
      </h3>
      <div className="flex items-baseline gap-1">
        <span className="text-5xl font-extrabold tracking-tight">{price}</span>
        {period && (
          <span
            className={`text-sm font-medium ${
              recommended
                ? "text-slate-400 dark:text-blue-200"
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {period}
          </span>
        )}
      </div>
      <p
        className={`mt-4 text-sm leading-relaxed ${
          recommended
            ? "text-slate-300 dark:text-blue-100"
            : "text-slate-500 dark:text-slate-400"
        }`}
      >
        Everything you need to{" "}
        {tier === "Free" ? "get started" : "supercharge your productivity"}.
      </p>
    </div>
    <ul className="space-y-4 mb-8 flex-grow">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-3 text-sm">
          <div
            className={`mt-0.5 p-0.5 rounded-full ${
              recommended
                ? "bg-blue-500/20 text-blue-300 dark:text-white"
                : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            }`}
          >
            <Check size={14} strokeWidth={3} />
          </div>
          <span
            className={
              recommended
                ? "text-slate-200 dark:text-blue-50"
                : "text-slate-700 dark:text-slate-300"
            }
          >
            {feature}
          </span>
        </li>
      ))}
    </ul>
    <button
      onClick={onDownload}
      className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${
        recommended
          ? "bg-white text-slate-900 hover:bg-blue-50 shadow-lg shadow-slate-900/20"
          : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white"
      }`}
    >
      {recommended ? "Install Pro" : "Get Started Free"}
    </button>
  </div>
);

export default PricingCard;
