import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  largeText: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  toggleLargeText: () => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  announceToScreenReader: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [largeText, setLargeText] = useState<boolean>(() => {
    return localStorage.getItem('ovia_a11y_large_text') === 'true';
  });
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('ovia_a11y_contrast') === 'true';
  });
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    return localStorage.getItem('ovia_a11y_reduced_motion') === 'true';
  });
  const [announcement, setAnnouncement] = useState<string>('');

  useEffect(() => {
    const root = document.documentElement;
    if (largeText) {
      root.classList.add('accessible-large-text');
    } else {
      root.classList.remove('accessible-large-text');
    }
    localStorage.setItem('ovia_a11y_large_text', String(largeText));
  }, [largeText]);

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('accessible-high-contrast');
    } else {
      root.classList.remove('accessible-high-contrast');
    }
    localStorage.setItem('ovia_a11y_contrast', String(highContrast));
  }, [highContrast]);

  const toggleLargeText = () => setLargeText((prev) => !prev);
  const toggleHighContrast = () => setHighContrast((prev) => !prev);
  const toggleReducedMotion = () => setReducedMotion((prev) => !prev);

  const announceToScreenReader = (message: string) => {
    setAnnouncement(message);
    // Clear after announcement
    setTimeout(() => setAnnouncement(''), 3000);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        largeText,
        highContrast,
        reducedMotion,
        toggleLargeText,
        toggleHighContrast,
        toggleReducedMotion,
        announceToScreenReader,
      }}
    >
      {children}
      {/* Invisible screen reader live region */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only fixed bottom-0 left-0 w-1 h-1 overflow-hidden"
      >
        {announcement}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};
