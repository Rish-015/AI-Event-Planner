import React from 'react';

export default function ThemeActivitiesBlock({ themeData }) {
  if (!themeData) return null;

  const concept = themeData.concept || "Minimalist pastel outdoor birthday theme";
  const colors = themeData.colors || ["#F6D6D6", "#FCEADE", "#D9E4DD", "#C9CBA3"];
  const activityIdeas = themeData.activity_ideas || themeData.activities || ["Photo booth", "Live music", "Lawn games"];

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm flex flex-col mb-lg">
      <div className="p-md border-b border-outline-variant bg-surface flex justify-between items-center">
        <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-xs">
          <span className="material-symbols-outlined text-secondary">explore</span>
          Theme & Recommended Activities
        </h3>
        <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-label-md text-[11px] font-semibold">
          AI Suggested Concept
        </span>
      </div>

      <div className="p-lg flex flex-col gap-lg">
        {/* Concept Description */}
        <div className="p-md rounded-lg bg-surface border border-outline-variant">
          <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider block mb-1">
            Design Concept
          </span>
          <p className="font-headline-md text-headline-md text-on-surface text-[16px]">
            {concept}
          </p>
        </div>

        {/* Color Palette Swatches */}
        <div>
          <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider block mb-sm">
            Curated Color Palette
          </span>
          <div className="flex flex-wrap gap-md">
            {colors.map((hex, i) => (
              <div key={i} className="flex items-center gap-sm bg-surface p-2 pr-3 rounded-lg border border-outline-variant">
                <div 
                  className="w-6 h-6 rounded-full border border-black/10 shadow-xs" 
                  style={{ backgroundColor: hex }}
                ></div>
                <span className="font-mono text-code-sm text-on-surface uppercase font-medium">
                  {hex}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Ideas */}
        <div>
          <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider block mb-sm">
            Suggested Activity Ideas
          </span>
          <div className="flex flex-wrap gap-sm">
            {activityIdeas.map((idea, i) => (
              <div 
                key={i} 
                className="bg-secondary/10 border border-secondary/20 text-secondary px-3 py-1.5 rounded-full font-label-md text-label-md flex items-center gap-xs"
              >
                <span className="material-symbols-outlined text-[16px]">stars</span>
                {idea}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
