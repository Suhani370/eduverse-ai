import React from 'react';
import { AlertCircle, Stethoscope } from 'lucide-react';

export const MedicalDisclaimerBanner: React.FC = () => {
  return (
    <div className="w-full rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-3.5 my-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-xs" id="medical-disclaimer-banner">
      <div className="p-1 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
        <Stethoscope className="w-4 h-4" />
      </div>
      <div>
        <div className="font-bold flex items-center gap-1.5 text-amber-950 dark:text-amber-100">
          <span>Educational Material Disclaimer</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-200/70 dark:bg-amber-900/80 text-amber-800 dark:text-amber-300">
            For Academic Reference Only
          </span>
        </div>
        <p className="text-[11px] text-amber-800 dark:text-amber-300/90 mt-0.5 leading-relaxed">
          This explanation is provided purely for academic and scientific understanding (anatomy, physiology, biochemical pathways). It does not constitute clinical medical advice, diagnosis, or treatment. Always consult a qualified physician or healthcare provider for personal health decisions.
        </p>
      </div>
    </div>
  );
};
