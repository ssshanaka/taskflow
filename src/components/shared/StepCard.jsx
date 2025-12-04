import React from 'react';

const StepCard = ({ number, title, description, icon: Icon }) => (
  <div className="relative flex flex-col items-center text-center group">
     <div className="w-16 h-16 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl mb-6 shadow-sm group-hover:scale-110 group-hover:shadow-md group-hover:border-blue-100 dark:group-hover:border-blue-900/30 transition-all duration-300 z-10 relative">
       <Icon size={28} strokeWidth={1.5} />
       <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold flex items-center justify-center border-4 border-white dark:border-slate-950 shadow-sm">
         {number}
       </div>
     </div>
     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
     <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs text-sm">{description}</p>
  </div>
);

export default StepCard;
