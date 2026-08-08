import React from 'react';

const CATEGORY_METADATA = {
  venue: { label: 'Venue', icon: 'location_city', color: '#3525cd' },
  catering: { label: 'Catering', icon: 'restaurant', color: '#0ea5e9' },
  decoration: { label: 'Decoration', icon: 'palette', color: '#ec4899' },
  cake: { label: 'Cake', icon: 'cake', color: '#f59e0b' },
  activities: { label: 'Activities', icon: 'celebration', color: '#006a61' },
  contingency: { label: 'Contingency', icon: 'savings', color: '#8b5cf6' },
  travel: { label: 'Travel & Accom.', icon: 'flight', color: '#8b5cf6' }
};

export default function BudgetBlock({ budgetData }) {
  let categoriesList = [];
  let totalAmount = 0;

  if (budgetData && typeof budgetData === 'object') {
    if (budgetData.categories && Array.isArray(budgetData.categories)) {
      // Array format fallback
      categoriesList = budgetData.categories;
      totalAmount = budgetData.total ? parseFloat(String(budgetData.total).replace(/[^0-9.]/g, '')) : 40000;
    } else {
      // Object format matching mock/backend schema: { venue: 10000, catering: 15000, ... total: 40000 }
      totalAmount = budgetData.total || 40000;

      Object.entries(budgetData).forEach(([key, val]) => {
        if (key === 'total' || typeof val !== 'number') return;
        const meta = CATEGORY_METADATA[key] || {
          label: key.charAt(0).toUpperCase() + key.slice(1),
          icon: 'category',
          color: '#3525cd'
        };

        const pct = totalAmount > 0 ? Math.round((val / totalAmount) * 100) : 0;

        categoriesList.push({
          key,
          name: meta.label,
          icon: meta.icon,
          color: meta.color,
          percentage: pct,
          amountNum: val,
          amountStr: `₹${val.toLocaleString('en-IN')}`
        });
      });
    }
  }

  const formattedTotal = typeof totalAmount === 'number' 
    ? `₹${totalAmount.toLocaleString('en-IN')}`
    : totalAmount;

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm flex flex-col">
      <div className="p-md border-b border-outline-variant bg-surface">
        <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary">pie_chart</span>
          Budget Allocation
        </h3>
      </div>
      
      <div className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-outline-variant text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                <th className="p-md font-semibold">Category</th>
                <th className="p-md font-semibold w-1/2">Allocation</th>
                <th className="p-md font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-body-md divide-y divide-outline-variant">
              {categoriesList.map((item, idx) => (
                <tr key={item.key || idx} className="hover:bg-surface-variant/50 transition-colors">
                  <td className="p-md font-medium text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-outline text-[18px]">
                      {item.icon || 'category'}
                    </span>
                    {item.name}
                  </td>
                  <td className="p-md align-middle">
                    <div className="w-full bg-surface-container-high rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${item.percentage}%`,
                          backgroundColor: item.color || '#3525cd' 
                        }}
                      ></div>
                    </div>
                  </td>
                  <td className="p-md text-right font-mono font-medium">
                    {item.amountStr || item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-surface border-t-2 border-outline-variant font-bold text-on-surface">
              <tr>
                <td className="p-md text-right uppercase tracking-wider font-label-md text-label-md" colSpan="2">
                  Total Estimated Budget
                </td>
                <td className="p-md text-right font-mono text-lg text-secondary">
                  {formattedTotal}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
