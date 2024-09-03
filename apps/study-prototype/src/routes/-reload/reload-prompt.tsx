// @ts-ignore

import React from 'react';
import classes from './reload-prompt.module.css';
// @ts-ignore
import { useRegisterSW } from 'virtual:pwa-register/react';

// @ts-ignore
declare module 'virtual:pwa-register/react' {
  import type { Dispatch, SetStateAction } from 'react';
  // @ts-ignore
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types';

  export type { RegisterSWOptions };

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: [boolean, Dispatch<SetStateAction<boolean>>]
    offlineReady: [boolean, Dispatch<SetStateAction<boolean>>]
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }
}

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegisteredSW(script: string) {
      // eslint-disable-next-line prefer-template
      console.log('SW Registered: ' + script);
    },
    onRegisterError(error: any) {
      console.log('SW registration error', error);
    }
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <div className={classes.ReloadPromptContainer}>
      {(offlineReady || needRefresh)
        && <div className={classes.ReloadPromptToast}>
          <div className={classes.ReloadPromptToastMessage}>
            {offlineReady
              ? <span>App ready to work offline</span>
              : <span>New content available, click on reload button to update.</span>
            }
          </div>
          {needRefresh && <button className={classes.ReloadPromptToastButton}
                                  onClick={() => updateServiceWorker(true)}>Reload</button>}
          <button className={classes.ReloadPromptToastButton} onClick={() => close()}>Close</button>
        </div>
      }
    </div>
  );
}

export default ReloadPrompt;
