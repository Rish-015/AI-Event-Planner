import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';

export default function PdfExportButton() {
  const [exporting, setExporting] = useState(false);

  const handleExportPdf = async () => {
    const element = document.getElementById('plan-export-section');
    if (!element) {
      console.warn('Target #plan-export-section not found');
      return;
    }

    setExporting(true);

    try {
      // Add pdf-hide class to hide unnecessary UI elements during export
      element.classList.add('pdf-export-active');

      const options = {
        margin: 10,
        filename: 'event-plan.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(options).from(element).save();
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      element.classList.remove('pdf-export-active');
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExportPdf}
      disabled={exporting}
      className="bg-surface-container-lowest border border-outline text-on-surface px-md py-[8px] rounded-lg font-label-md text-label-md hover:bg-surface-variant transition-colors shadow-sm flex items-center gap-xs cursor-pointer disabled:opacity-60"
    >
      {exporting ? (
        <>
          <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
          Generating PDF…
        </>
      ) : (
        <>
          <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
          Export as PDF
        </>
      )}
    </button>
  );
}
