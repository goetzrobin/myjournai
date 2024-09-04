import React from 'react';
import { Button, ToggleButton } from '~myjournai/components';
import { FeelingAwfulIcon, FeelingGoodIcon, FeelingGreatIcon, FeelingMehIcon } from './feeling-icons';

export const FeelingIndicator = ({ value, setValue, onNextClick }: {
  onNextClick: () => void;
  value: number | undefined;
  setValue: (value: number) => void
}) => {
  return (
    <div className="pt-12">
      <h3 className="pb-8 uppercase tracking-tight font-semibold">How are you feeling right now?</h3>
      <div className="pb-12 gap-2 flex items-center justify-between">
        <ToggleButton onPress={() => setValue(0)} isSelected={value === 0} className="p-0">
          <FeelingAwfulIcon className="size-14" />
          <span className="text-xs text-center">Awful</span></ToggleButton>
        <ToggleButton onPress={() => setValue(1)} isSelected={value === 1} className="p-0">
          <FeelingMehIcon className="size-14" />
          <span className="text-xs text-center">Meh</span></ToggleButton>
        <ToggleButton onPress={() => setValue(2)} isSelected={value === 2} className="p-0">
          <FeelingGoodIcon className="size-14" />
          <span className="text-xs text-center">Good</span>
        </ToggleButton>
        <ToggleButton onPress={() => setValue(3)} isSelected={value === 3} className="p-0">
          <FeelingGreatIcon className="size-14" />
          <span className="text-xs text-center">Great</span>
        </ToggleButton>
      </div>
      <Button onPress={onNextClick} isDisabled={value === undefined} variant="secondary"
              className="w-full">Next</Button>
    </div>
  );
};
