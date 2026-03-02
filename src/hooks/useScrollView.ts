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
