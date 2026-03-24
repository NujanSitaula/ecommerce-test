import { useEffect, RefObject } from 'react';

export function useActiveScroll<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  topOffset: number = 80,
) {
  useEffect(() => {
    if (ref === null) return;

    const element = ref?.current;
    const listener = () => {
      if (window.scrollY > topOffset) {
        element?.classList.add('is-scrolling');
      } else {
        element?.classList.remove('is-scrolling');
      }
    };
    document.addEventListener('scroll', listener);
    return () => {
      document.removeEventListener('scroll', listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
