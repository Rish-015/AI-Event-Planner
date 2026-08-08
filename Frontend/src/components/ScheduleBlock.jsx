import React from 'react';
import { formatTo12Hour } from '../utils/timeUtils';

export default function ScheduleBlock({ schedule = [] }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm flex flex-col">
      <div className="p-md border-b border-outline-variant bg-surface flex justify-between items-center">
        <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary">schedule</span>
          Proposed Schedule
        </h3>
        <button className="pdf-hide text-primary text-body-md hover:underline font-semibold cursor-pointer">
          Edit
        </button>
      </div>

      <div className="p-lg relative">
        {/* Vertical Line */}
        <div className="absolute left-[39px] md:left-[91px] top-lg bottom-lg w-[2px] bg-outline-variant"></div>

        <div className="flex flex-col gap-lg">
          {schedule.map((item, index) => {
            const timeRaw = item.time || "09:00 AM";
            const timeFormatted = formatTo12Hour(timeRaw);
            const activityText = item.activity || item.title || "Scheduled Activity";
            const descriptionText = item.description;
            const isAiSuggested = item.isAiSuggested || item.isAi;

            return (
              <div key={index} className="flex items-start gap-md relative z-10">
                <div className="w-20 text-right pt-1 shrink-0">
                  <span className={`font-label-md text-label-md ${isAiSuggested ? 'text-secondary font-bold' : 'text-on-surface-variant'}`}>
                    {timeFormatted}
                  </span>
                </div>

                <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 border-2 border-white shadow-sm ${
                  isAiSuggested ? 'bg-secondary' : index === 0 ? 'bg-primary' : 'bg-outline-variant'
                }`}></div>

                <div className={`p-md rounded-lg border flex-1 hover:shadow-md transition-shadow ${
                  isAiSuggested 
                    ? 'bg-secondary/5 border-secondary/20' 
                    : 'bg-surface border-outline-variant'
                }`}>
                  <div className="flex justify-between items-start">
                    <h4 className="font-headline-md text-headline-md text-on-surface text-[16px]">
                      {activityText}
                    </h4>
                    {isAiSuggested && (
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        auto_awesome
                      </span>
                    )}
                  </div>
                  {descriptionText && (
                    <p className="text-on-surface-variant text-body-md mt-1">
                      {descriptionText}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
