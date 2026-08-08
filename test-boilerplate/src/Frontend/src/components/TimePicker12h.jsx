import React from 'react';

export default function TimePicker12h({ value, onChange }) {
  // Parse current 12-hour formatted time ("05:00 PM")
  const parseTime = (timeStr) => {
    if (!timeStr) return { hour: '05', minute: '00', period: 'PM' };
    
    // Match 12h format "05:00 PM"
    const match12 = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match12) {
      let h = parseInt(match12[1], 10);
      const formattedH = h < 10 ? `0${h}` : `${h}`;
      return {
        hour: formattedH,
        minute: match12[2],
        period: match12[3].toUpperCase()
      };
    }

    // Match 24h format "17:00"
    const match24 = timeStr.trim().match(/^(\d{1,2}):(\d{2})$/);
    if (match24) {
      let h = parseInt(match24[1], 10);
      const period = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      if (h === 0) h = 12;
      const formattedH = h < 10 ? `0${h}` : `${h}`;
      return {
        hour: formattedH,
        minute: match24[2],
        period
      };
    }

    return { hour: '05', minute: '00', period: 'PM' };
  };

  const { hour, minute, period } = parseTime(value);

  const hoursList = Array.from({ length: 12 }, (_, i) => {
    const h = i + 1;
    return h < 10 ? `0${h}` : `${h}`;
  });

  const minutesList = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

  const updateTime = (newHour, newMinute, newPeriod) => {
    const time12h = `${newHour}:${newMinute} ${newPeriod}`;
    onChange(time12h);
  };

  return (
    <div className="w-full h-[58px] px-2 sm:px-3 bg-surface-container-lowest border border-outline-variant rounded-lg flex items-center justify-between gap-1 text-on-surface focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/20 transition-all duration-200 overflow-hidden">
      {/* Clock Icon */}
      <div className="flex items-center pointer-events-none text-outline shrink-0 pl-1">
        <span className="material-symbols-outlined text-[20px]">schedule</span>
      </div>

      {/* Time Pickers (Hour : Minute) */}
      <div className="flex items-center justify-center gap-1.5 flex-1 min-w-0">
        {/* Hour Select - [background-image:none] removes @tailwindcss/forms select arrow */}
        <select
          value={hour}
          onChange={(e) => updateTime(e.target.value, minute, period)}
          className="appearance-none [background-image:none] w-[38px] h-[34px] bg-surface-container-low border border-outline-variant rounded-md font-body-lg text-body-lg text-on-surface text-center font-bold focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer p-0 shrink-0"
        >
          {hoursList.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>

        {/* Separator Colon */}
        <span className="font-bold text-on-surface-variant text-base shrink-0 font-mono px-0.5 select-none">:</span>

        {/* Minute Select - [background-image:none] removes @tailwindcss/forms select arrow */}
        <select
          value={minute}
          onChange={(e) => updateTime(hour, e.target.value, period)}
          className="appearance-none [background-image:none] w-[38px] h-[34px] bg-surface-container-low border border-outline-variant rounded-md font-body-lg text-body-lg text-on-surface text-center font-bold focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer p-0 shrink-0"
        >
          {minutesList.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* AM/PM Segmented Toggle Control */}
      <div className="flex items-center bg-surface-container-high rounded-md p-0.5 border border-outline-variant/60 shrink-0">
        <button
          type="button"
          onClick={() => updateTime(hour, minute, 'AM')}
          className={`px-2 py-1 rounded text-[11px] font-bold uppercase transition-colors cursor-pointer leading-none ${
            period === 'AM'
              ? 'bg-primary text-on-primary font-bold shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          AM
        </button>
        <button
          type="button"
          onClick={() => updateTime(hour, minute, 'PM')}
          className={`px-2 py-1 rounded text-[11px] font-bold uppercase transition-colors cursor-pointer leading-none ${
            period === 'PM'
              ? 'bg-primary text-on-primary font-bold shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          PM
        </button>
      </div>
    </div>
  );
}
