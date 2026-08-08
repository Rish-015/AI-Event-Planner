import React, { useState } from 'react';

export default function InvitationCard({ invitationUrl, themeConcept, invitationText }) {
  const [activeTab, setActiveTab] = useState('image'); // 'image' or 'text'
  const [copied, setCopied] = useState(false);

  const imageUrl = invitationUrl || "https://placehold.co/500x700";
  const conceptText = themeConcept || 'Minimalist pastel outdoor birthday theme';
  const textMsg = invitationText || "You're cordially invited to celebrate with us! Join us for a wonderful event full of fun, games, and great memories.";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textMsg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
      {/* Header & Tabs */}
      <div className="border-b border-outline-variant flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-surface">
        <div className="p-md flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary">mail</span>
          <h3 className="font-headline-md text-headline-md text-on-surface">
            Event Invitation
          </h3>
        </div>
        
        {/* Tab Controls */}
        <div className="flex border-t sm:border-t-0 border-outline-variant">
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 sm:flex-initial px-lg py-md font-label-md text-label-md transition-all duration-200 border-b-2 cursor-pointer flex items-center justify-center gap-xs ${
              activeTab === 'image'
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-on-surface-variant hover:bg-surface-variant/50'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">image</span>
            Image Card
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 sm:flex-initial px-lg py-md font-label-md text-label-md transition-all duration-200 border-b-2 cursor-pointer flex items-center justify-center gap-xs ${
              activeTab === 'text'
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-on-surface-variant hover:bg-surface-variant/50'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">notes</span>
            Text Message
          </button>
        </div>
      </div>
      
      {/* Tab Contents */}
      <div className="p-lg">
        {activeTab === 'image' ? (
          <div className="flex flex-col md:flex-row gap-lg items-start">
            {/* Image display */}
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
            
            <div className="w-full md:w-1/2 flex flex-col gap-md self-stretch justify-between">
              <div className="flex flex-col gap-xs">
                <span className="text-outline uppercase font-label-md text-label-md tracking-wider">Concept</span>
                <p className="text-on-surface-variant text-body-md">
                  {conceptText}
                </p>
              </div>
              
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
        ) : (
          <div className="flex flex-col gap-lg">
            {/* Text invitation message display */}
            <div className="bg-surface-variant/40 border border-outline-variant rounded-lg p-lg relative group">
              <div className="absolute top-md right-md pdf-hide">
                <button 
                  onClick={handleCopy}
                  title="Copy to clipboard"
                  className="bg-surface border border-outline-variant hover:bg-surface-container text-on-surface-variant p-2 rounded-md transition-colors flex items-center justify-center cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  {copied && <span className="ml-xs font-label-md text-label-md text-primary">Copied!</span>}
                </button>
              </div>
              <p className="text-on-surface font-body-lg whitespace-pre-line leading-relaxed pr-[48px]">
                {textMsg}
              </p>
            </div>

            <div className="pdf-hide flex justify-end gap-md pt-sm">
              <button 
                onClick={handleCopy} 
                className="px-lg bg-primary text-on-primary py-2 rounded-lg font-label-md text-label-md hover:bg-primary-container flex items-center justify-center gap-xs transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">{copied ? 'check' : 'content_copy'}</span> 
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
