import { useState } from 'react';
import { TextField, ToggleButton } from '~myjournai/components';

export const OtherToggleButtonAndInput = ({
                                            label,
                                            possibleAnswerValue,
                                            currentAnswerValue,
                                            currentAnswerCustomValue,
                                            onPressAndInput
                                          }: {
  label: string,
  possibleAnswerValue: string | number | undefined,
  currentAnswerValue: string | number | undefined,
  currentAnswerCustomValue: string | number | null | undefined,
  onPressAndInput: (customValue: string | number | undefined) => void
}) => {
  const [input, setInput] = useState<string | undefined>();
  return (<div className="w-full">
    <ToggleButton className="mb-2 w-full text-left"
                  isSelected={currentAnswerValue === possibleAnswerValue}
                  onPress={() => onPressAndInput(input)}>{label}</ToggleButton>
    {currentAnswerValue === possibleAnswerValue ?
      <TextField value={currentAnswerCustomValue ? `${currentAnswerCustomValue}` : input} aria-label={label} onChange={(value) => {
        setInput(value);
        onPressAndInput(value);
      }} /> : null}
  </div>);
};
