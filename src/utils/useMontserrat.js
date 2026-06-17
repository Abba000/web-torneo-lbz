import { useEffect } from 'react';

export function useMontserrat() {
  useEffect(() => {
    if (!document.querySelector('[data-font="montserrat"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap';
      link.setAttribute('data-font', 'montserrat');
      document.head.appendChild(link);
    }
  }, []);
}
