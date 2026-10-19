import React from 'react';
import { Eye, Type, VolumeX } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

export const AccessibilityToolbar: React.FC = () => {
  const {
    largeText,
    highContrast,
    toggleLargeText,
    toggleHighContrast,
    announceToScreenReader,
  } = useAccessibility();

  const handleContrastClick = () => {
    toggleHighContrast();
    announceToScreenReader(highContrast ? 'Standard contrast enabled' : 'High contrast mode enabled');
  };

  const handleTextSizeClick = () => {
    toggleLargeText();
    announceToScreenReader(largeText ? 'Standard text size enabled' : 'Larger readable text size enabled');
  };

  return (
    <div
      role="region"
      aria-label="Accessibility settings"
      className="inline-flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 text-slate-700 text-xs"
    >
      <button
        onClick={handleContrastClick}
        title="Toggle High Contrast"
        aria-pressed={highContrast}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md transition-colors cursor-pointer ${
          highContrast ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-200 text-slate-700'
        }`}
      >
        <Eye className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Contrast</span>
      </button>

      <button
        onClick={handleTextSizeClick}
        title="Toggle Larger Text"
        aria-pressed={largeText}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md transition-colors cursor-pointer ${
          largeText ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-200 text-slate-700'
        }`}
      >
        <Type className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Text Size</span>
      </button>

      <div
        title="Deaf and Mute Friendly: All feedback in OVIA is visual and does not require audio."
        className="inline-flex items-center gap-1 px-2 py-1 text-slate-500 font-medium"
      >
        <VolumeX className="w-3.5 h-3.5 text-emerald-600" />
        <span className="hidden md:inline text-[11px] text-emerald-700 font-medium">Visual Feedback Active</span>
      </div>
    </div>
  );
};
