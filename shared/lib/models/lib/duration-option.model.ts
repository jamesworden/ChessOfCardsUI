export enum DurationOption {
  FiveMinutes = 'FiveMinutes',
  ThreeMinutes = 'ThreeMinutes',
  OneMinute = 'OneMinute',
}

export const DURATION_OPTIONS_TO_MINUTES = {
  [DurationOption.FiveMinutes]: 5,
  [DurationOption.ThreeMinutes]: 3,
  [DurationOption.OneMinute]: 1,
};
