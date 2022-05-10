import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
};

export const IS_MOBILE_QUERY = '(max-width: 960px)';

export const useMobileActions = (
  deps: any[],
  callback: (isMobile: boolean) => void,
) => {
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);
  useEffect(() => {
    callback(isMobile);
  }, [isMobile, ...deps]);
  return isMobile;
};
