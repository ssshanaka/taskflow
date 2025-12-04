import React from "react";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="p-6 bg-gray-100 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
      <Icon size={24} />
    </div>
    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
      {description}
    </p>
  </div>
);

export default FeatureCard;
