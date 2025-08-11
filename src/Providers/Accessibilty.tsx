import React, { createContext, useContext, useState, useEffect } from 'react';

type FontSizeContextType = {
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
};

const FontSizeContext = createContext<FontSizeContextType>({
  scale: 1,
  setScale: () => {}
});

const STORAGE_KEY = 'font-size-scale';

export const FontSizeProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [scale, setScale] = useState<number>(() => {
    const storedSize = localStorage.getItem(STORAGE_KEY);
    return storedSize ? parseFloat(storedSize) : 1;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, scale.toString());
    document.documentElement.style.fontSize = `${scale * 16}px`;
  }, [scale]);

  return (
    <FontSizeContext.Provider value={{ scale, setScale }}>
      {children}
    </FontSizeContext.Provider>
  );
};

// Hook
const MAX_SCALE = 1.5;
const MIN_SCALE = 0.8;
const STEP = 0.1;

// eslint-disable-next-line react-refresh/only-export-components
export const useFontSize = () => {
  const { scale, setScale } = useContext(FontSizeContext);

  const increaseFontSize = () => {
    if (scale < MAX_SCALE) {
      setScale(parseFloat((scale + STEP).toFixed(2)));
    }
  };

  const decreaseFontSize = () => {
    if (scale > MIN_SCALE) {
      setScale(parseFloat((scale - STEP).toFixed(2)));
    }
  };

  const canIncrease = scale < MAX_SCALE;
  const canDecrease = scale > MIN_SCALE;

  return {
    scale,
    increaseFontSize,
    decreaseFontSize,
    canIncrease,
    canDecrease
  };
};
