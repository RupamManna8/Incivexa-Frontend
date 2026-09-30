import React from 'react';
import { Construction } from 'lucide-react';

export function PlaceholderPage({ title, description, icon: Icon = Construction }) {
  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          {description && (
            <p className="text-[13px] text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-16 text-center">
        <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto mb-3">
          <Icon className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-[14px] font-semibold text-gray-900 mb-1">Coming Soon</h3>
        <p className="text-[13px] text-gray-500 max-w-md mx-auto">
          This module is under development. The {title.toLowerCase()} functionality will be available in the next release.
        </p>
      </div>
    </div>
  );
}
