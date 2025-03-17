import React, { useState } from 'react';
import { Button, Dialog, Modal } from '~myjournai/components';
import { PlusIcon, XIcon } from 'lucide-react';
import { DialogTrigger } from 'react-aria-components';
import { AddLocalContext } from './AddLocalContext';

interface LocalContextModalProps {
  cohortId: string | null;
  cohortName: string | null;
  onSuccess?: () => void;
  buttonLabel?: string;
  disabled?: boolean;
}

export function LocalContextModal({
                                    cohortId,
  cohortName,
                                    onSuccess,
                                    buttonLabel = 'Add Local Context',
                                    disabled = false
                                  }: LocalContextModalProps) {
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
          isDisabled={disabled || !cohortId}
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
                Add Local Context for {cohortName}
              </h2>
              <Button
                variant="icon"
                onPress={handleClose}
              >
                <XIcon className="w-5 h-5" />
              </Button>
            </div>

            {cohortId ?
            <AddLocalContext
              cohortId={cohortId}
              onSuccess={handleSuccess}
              onCancel={handleClose}
            /> : <p>No cohort selected</p>}
          </Dialog>
        </Modal>
      </DialogTrigger>
    </>
  );
}
