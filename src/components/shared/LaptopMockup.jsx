import React from 'react';

const LaptopMockup = ({ children }) => (
  <div className="relative mx-auto w-full max-w-[900px] perspective-1000 group">
    <div className="relative bg-slate-900 rounded-t-2xl p-2 md:p-3 shadow-2xl ring-1 ring-slate-800 transition-transform duration-700 ease-out group-hover:rotate-x-1 origin-bottom">
      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex gap-2"><div className="w-1 h-1 rounded-full bg-slate-600" /><div className="w-1 h-1 rounded-full bg-slate-800 border border-slate-700" /></div>
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded overflow-hidden relative aspect-[16/10] flex items-center justify-center p-4 md:p-8 lg:p-10">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
         <div className="w-full h-full max-h-[600px] shadow-2xl rounded-lg overflow-hidden flex flex-col transition-all duration-300 transform group-hover:scale-[1.01]">{children}</div>
      </div>
    </div>
    <div className="relative bg-slate-800 h-3 md:h-4 w-full rounded-b-sm mx-auto shadow-md z-10 border-t border-slate-700"></div>
    <div className="relative bg-slate-800 h-2 md:h-4 w-[120%] -ml-[10%] rounded-b-xl shadow-2xl flex justify-center border-t border-slate-900/50"><div className="w-1/3 h-1.5 bg-slate-700/50 rounded-b-md mt-0"></div></div>
  </div>
);

export default LaptopMockup;
