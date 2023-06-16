"use client";

import * as RadixSlider from "@radix-ui/react-slider";

interface SliderProps {
  ariaLabel: string;
  value?: number;
  onChange?: (value: number) => void;
  defaultValue?: number;
  max?: number;
  step?: number;
}

const Slider: React.FC<SliderProps> = ({
  ariaLabel,
  value = 1,
  onChange,
  defaultValue = 0,
  max = 1,
  step = 1,
}) => {
  const handleChange = (newValue: number[]) => {
    onChange?.(newValue[0]);
  }

  return (
    <RadixSlider.Root
      className="
        group
        relative
        flex
        items-center
        select-none
        touch-none
        w-full
        h-3
      "
      defaultValue={[defaultValue]}
      value={[value]}
      onValueChange={handleChange}
      max={max}
      step={step}
      aria-label={ariaLabel}
    >
      <RadixSlider.Track
        className="
          bg-neutral-600
          relative
          grow
          rounded-full
          h-[3px]
        "
      >
        <RadixSlider.Range
          className="
            absolute
            bg-white
            rounded-full
            h-full
            group-hover:bg-green-500
          "
        />
      </RadixSlider.Track>
      <RadixSlider.Thumb className="block h-3 w-3 rounded-full bg-white opacity-0 group-hover:opacity-100" />
    </RadixSlider.Root>
  );
}

export default Slider;
