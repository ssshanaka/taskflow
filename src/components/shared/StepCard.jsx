import React from 'react';

const StepCard = ({ number, title, description, icon: Icon }) => (
  <div className="relative pl-8 md:pl-0">
     <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -z-10 last:hidden"></div>
     <div className="flex flex-col md:items-center text-left md:text-center">
        <div className="w-16 h-16 bg-white dark:bg-slate-900 border-4 border-blue-50 dark:border-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl mb-4 shadow-sm z-10 relative"><Icon size={28} /><div className="absolute -top-1 -right-1 w-6 h-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-xs flex items-center justify-center border-2 border-white dark:border-slate-900">{number}</div></div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">{description}</p>
     </div>
  </div>
);

export default StepCard;
