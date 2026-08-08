import React from 'react';

export default function InvitationCard({ invitationUrl, themeConcept }) {
  const imageUrl = invitationUrl || "https://placehold.co/500x700";
  const conceptText = themeConcept || 'Minimalist pastel outdoor birthday theme';

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
      <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface">
        <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary">mail</span>
          Event Invitation Design
        </h3>
        <span className="bg-primary-fixed-dim text-primary px-2 py-1 rounded font-label-md text-label-md">
          AI Generated
        </span>
      </div>
      
      <div className="p-lg flex flex-col md:flex-row gap-lg items-start">
        <div className="w-full md:w-1/2 aspect-video md:aspect-square relative rounded-lg overflow-hidden border border-outline-variant shadow-sm group">
          <img 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            src={imageUrl} 
            alt="Event Invitation Preview"
          />
          <div className="pdf-hide absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-md">
            <button className="bg-white/90 text-on-surface p-2 rounded-full hover:bg-white transition-colors">
              <span className="material-symbols-outlined">zoom_in</span>
            </button>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 flex flex-col gap-md">
          <p className="text-on-surface-variant text-body-md">
            {conceptText}
          </p>
          
          <div className="pdf-hide flex gap-md mt-auto pt-md border-t border-outline-variant">
            <button className="flex-1 border border-outline text-on-surface py-2 rounded-lg font-label-md text-label-md hover:bg-surface-variant flex items-center justify-center gap-xs transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">download</span> 
              Download PDF
            </button>
            <button className="flex-1 bg-primary text-on-primary py-2 rounded-lg font-label-md text-label-md hover:bg-primary-container flex items-center justify-center gap-xs transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">share</span> 
              Share Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
