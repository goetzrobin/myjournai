import React from 'react';
import { Button, ToggleButton } from '~myjournai/components';
import {
  MotivationEmptyIcon,
  MotivationHighlyIcon,
  MotivationQuiteIcon,
  MotivationSlighltyIcon
} from './motivation-icons';

export const MotivationIndicator = ({ value, setValue, onNextClick }: {
  onNextClick: () => void;
  value: number | undefined;
  setValue: (value: number) => void
}) => {
  return (
    <div className="pt-12">
      <h3 className="pb-8 uppercase tracking-tight font-semibold">How motivated do you feel right now?</h3>
      <div className="pb-12 gap-2 flex items-center justify-between">
        <ToggleButton onPress={() => setValue(0)} isSelected={value === 0} className="p-0">
          <MotivationEmptyIcon className="size-14" />
          <span className="text-xs text-center">Not at All</span></ToggleButton>
        <ToggleButton onPress={() => setValue(1)} isSelected={value === 1} className="p-0">
          <MotivationSlighltyIcon className="size-14" />
          <span className="text-xs text-center">Slightly</span></ToggleButton>
        <ToggleButton onPress={() => setValue(2)} isSelected={value === 2} className="p-0">
          <MotivationQuiteIcon className="size-14" />
          <span className="text-xs text-center">Quite</span>
        </ToggleButton>
        <ToggleButton onPress={() => setValue(3)} isSelected={value === 3} className="p-0">
          <MotivationHighlyIcon className="size-14" />
          <span className="text-xs text-center">Highly</span>
        </ToggleButton>
      </div>
      <Button onPress={onNextClick} isDisabled={value === undefined} variant="secondary"
              className="w-full">Next</Button>
    </div>
  );
};
