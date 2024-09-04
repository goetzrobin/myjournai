import React from 'react';
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '~myjournai/components';

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

  const reload = async () => await updateServiceWorker(true)

  return (<Drawer open={(offlineReady || needRefresh)}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>journai just got better!</DrawerTitle>
          <DrawerDescription>Reload the application to get the newest sessions we have added!</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button onPress={reload}>Reload App</Button>
          <DrawerClose>
            <Button className="w-full" onPress={close} variant="secondary">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default ReloadPrompt;
