import { PropsWithChildren, useEffect } from 'react';
import { useMobileNavActions } from './mobile-nav.store';

export const WithMobileNav = ({children}: PropsWithChildren) => {
  const { setShowingMobileNav } = useMobileNavActions();
  useEffect(() => {
    setShowingMobileNav(true);
    return () => setShowingMobileNav(false);
  }, [setShowingMobileNav]);
  return children
}
