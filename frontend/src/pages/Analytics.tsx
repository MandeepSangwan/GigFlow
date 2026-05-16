import React from 'react';

const Analytics: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-xl gap-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-background">Analytics</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Insights and reports on your lead generation performance.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-lg">
        <div className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <h3 className="font-title-md text-title-md text-on-surface-variant mb-xs">Total Leads</h3>
          <p className="font-display-sm text-display-sm text-primary">1,248</p>
          <span className="font-label-sm text-label-sm text-success flex items-center mt-sm">
            <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span> +12% from last month
          </span>
        </div>
        <div className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <h3 className="font-title-md text-title-md text-on-surface-variant mb-xs">Conversion Rate</h3>
          <p className="font-display-sm text-display-sm text-primary">24.5%</p>
          <span className="font-label-sm text-label-sm text-success flex items-center mt-sm">
            <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span> +2.1% from last month
          </span>
        </div>
        <div className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <h3 className="font-title-md text-title-md text-on-surface-variant mb-xs">Lost Leads</h3>
          <p className="font-display-sm text-display-sm text-error">89</p>
          <span className="font-label-sm text-label-sm text-error flex items-center mt-sm">
            <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span> +5% from last month
          </span>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-xl flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <span className="material-symbols-outlined text-[64px] text-on-surface-variant mb-md opacity-50">bar_chart</span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs">Detailed Charts Coming Soon</h3>
          <p className="font-body-md text-body-md text-on-surface-variant">We are integrating advanced visualizations for your sales funnel.</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
