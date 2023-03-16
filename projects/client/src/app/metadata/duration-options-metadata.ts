import { DurationOption } from '../models/duration-option.model';

type DurationOptionMetadata = {
  durationOption: DurationOption;
  minutes: number;
};

export const durationOptionsMetadata: DurationOptionMetadata[] = [
  {
    durationOption: DurationOption.FiveMinutes,
    minutes: 5,
  },
  {
    durationOption: DurationOption.ThreeMinutes,
    minutes: 3,
  },
  {
    durationOption: DurationOption.OneMinute,
    minutes: 1,
  },
];
