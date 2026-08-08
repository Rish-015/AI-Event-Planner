import React, { useState, useEffect } from 'react';

export default function ChecklistBlock({ checklist = [] }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Normalize item props matching backend schema ({ task, due_date, status, priority })
    const normalized = checklist.map((item, index) => ({
      id: item.id || index + 1,
      title: item.task || item.title || `Task #${index + 1}`,
      dueDate: item.due_date || item.dueDate || '',
      priority: item.priority || 'Medium',
      completed: item.status === 'completed' || item.completed || false
    }));
    setItems(normalized);
  }, [checklist]);

  const toggleItem = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const getPriorityStyle = (priority, completed) => {
    if (completed) {
      return 'bg-surface-variant text-on-surface-variant border border-outline-variant';
    }
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]';
      case 'medium':
        return 'bg-[#fffbeb] text-[#92400e] border border-[#fde68a]';
      default:
        return 'bg-surface-container text-on-surface-variant border border-outline-variant';
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm flex flex-col mb-lg">
      <div className="p-md border-b border-outline-variant bg-surface flex justify-between items-center">
        <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary">checklist</span>
          Immediate Tasks
        </h3>
        <span className="bg-primary-container/20 text-primary px-2.5 py-0.5 rounded-full font-label-md text-[11px] font-semibold">
          {items.filter(i => !i.completed).length} Pending
        </span>
      </div>

      <div className="p-sm flex flex-col gap-sm">
        {items.map((item) => (
          <div
            key={item.id}
            className={`group flex items-center gap-md p-md rounded-lg border transition-all ${
              item.completed
                ? 'bg-surface-container opacity-60 border-transparent'
                : 'bg-white border-transparent hover:border-outline-variant hover:bg-surface'
            }`}
          >
            <span className="pdf-hide material-symbols-outlined text-outline-variant cursor-grab">
              drag_indicator
            </span>
            
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleItem(item.id)}
              className="pdf-hide w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
            />
            
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className={`text-on-surface font-medium ${item.completed ? 'line-through' : ''}`}>
                  {item.title}
                </span>
                {item.dueDate && (
                  <span className="text-[11px] text-outline font-code-sm">
                    Due: {item.dueDate}
                  </span>
                )}
              </div>
              
              <span className={`px-2 py-0.5 rounded font-label-md text-[11px] uppercase tracking-wide font-bold self-start sm:self-auto ${getPriorityStyle(item.priority, item.completed)}`}>
                {item.completed ? 'Completed' : `${item.priority} Priority`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
