import React, { useState } from 'react';
import { Button, Dialog, Modal } from '~myjournai/components';
import { PlusIcon, XIcon } from 'lucide-react';
import { AddGlobalContext } from './AddGlobalContext';
import { DialogTrigger } from 'react-aria-components';

interface GlobalContextModalProps {
  onSuccess?: () => void;
  buttonLabel?: string;
}

export function GlobalContextModal({
                                     onSuccess,
                                     buttonLabel = 'Add Context'
                                   }: GlobalContextModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSuccess = () => {
    onSuccess?.();
    handleClose();
  };

  return (
    <>
      {/* Trigger Button */}
      <DialogTrigger isOpen={isOpen}>
      <Button
        onPress={handleOpen}
        className="inline-flex items-center"
      >
        <PlusIcon className="w-4 h-4 mr-2" />
        {buttonLabel}
      </Button>
        <Modal className="min-w-[800px] max-w-[1200px]">
        <Dialog
          aria-labelledby="add-context-title"
        >
          <div className="flex justify-between items-center mb-5">
            <h2 id="add-context-title" className="text-xl font-semibold">
              Add Global Context
            </h2>
            <Button
              variant="icon"
              onPress={handleClose}
            >
              <XIcon className="w-5 h-5" />
            </Button>
          </div>

            <AddGlobalContext
              onSuccess={handleSuccess}
              onCancel={handleClose}
            />
        </Dialog>
        </Modal>
      </DialogTrigger>
    </>
  );
}
