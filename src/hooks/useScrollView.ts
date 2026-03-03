import React from 'react';

export const getScrollConfig = () => {
  if (typeof window !== 'undefined') {
    if (window.innerWidth <= 480) {
      return { x: 600 };
    } else if (window.innerWidth <= 768) {
      return { x: 700 };
    } else if (window.innerWidth <= 1024) {
      return { x: 800 };
    }
  }
  return { x: 900 };
};

export const useWindowWidth = (): number => {
  const [width, setWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
};
