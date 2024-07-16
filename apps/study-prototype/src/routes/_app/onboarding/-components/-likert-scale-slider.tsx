import {
  Slider as AriaSlider,
  SliderProps as AriaSliderProps,
  SliderOutput,
  SliderThumb,
  SliderTrack
} from 'react-aria-components';
import { tv } from 'tailwind-variants';
import { composeTailwindRenderProps, focusRing, Label } from '~myjournai/components';

const trackStyles = tv({
  base: 'rounded-full',
  variants: {
    orientation: {
      horizontal: 'w-full h-[6px]',
      vertical: 'h-full w-[6px] ml-[50%] -translate-x-[50%]'
    },
    isDisabled: {
      false: 'bg-muted',
      true: 'bg-muted'
    }
  }
});

const thumbStyles = tv({
  extend: focusRing,
  base: 'size-8 group-orientation-horizontal:mt-8 shadow-lg group-orientation-vertical:ml-3 rounded-full bg-blue-500 dark:bg-zinc-900 border-4 border-blue-50 dark:border-gray-300',
  variants: {
    isDragging: {
      true: 'bg-blue-700 dark:bg-gray-300 forced-colors:bg-[ButtonBorder]'
    },
    isDisabled: {
      true: 'border-blue-300 dark:border-zinc-700 forced-colors:border-[GrayText]'
    }
  }
});

export interface LikertScaleSliderProps<T> extends AriaSliderProps<T> {
  label?: string;
  thumbLabels?: string[];
}

const likertScaleLabels = ['Strongly Disagree', 'Disagree', 'Neither disagree nor agree', 'Agree', 'Strongly Agree'];

export function LikertScaleSlider<T extends number | number[]>(
  { value, onChange, label, thumbLabels, ...props }: LikertScaleSliderProps<T>
) {
  return (
    <>
      <div className="mb-8 flex items-end justify-between">
        <div className={(value === 1 ? 'bg-blue-500' : 'bg-muted') + ' transition-colors w-3 rounded-full h-40'} />
        <div className={(value === 2 ? 'bg-blue-500' : 'bg-muted') + ' transition-colors w-3 rounded-full h-32'} />
        <div className={(value === 3 ? 'bg-blue-500' : 'bg-muted') + ' transition-colors w-3 rounded-full h-24'} />
        <div className={(value === 4 ? 'bg-blue-500' : 'bg-muted') + ' transition-colors w-3 rounded-full h-32'} />
        <div className={(value === 5 ? 'bg-blue-500' : 'bg-muted') + ' transition-colors w-3 rounded-full h-40'} />
      </div>
      <AriaSlider {...props} value={value} onChange={onChange} minValue={1} maxValue={5} step={1}
                  className={composeTailwindRenderProps(props.className, '')}>
        <Label className="sr-only">{label}</Label>
        <SliderTrack
          className="group col-span-2 orientation-horizontal:h-6 orientation-vertical:w-6 orientation-vertical:h-64 flex items-center">
          {({ state, ...renderProps }) => <>
            <div className={trackStyles(renderProps)} />
            {state.values.map((_, i) => <SliderThumb key={i} index={i} aria-label={thumbLabels?.[i]}
                                                     className={thumbStyles} />)}
          </>}
        </SliderTrack>
        <SliderOutput className="mt-4 block text-xl font-bold text-center text-muted-foreground">
          {({ state }) => state.values.map((_, i) => likertScaleLabels[state.getThumbValue(i) - 1])}
        </SliderOutput>
      </AriaSlider>
    </>
  );
}
