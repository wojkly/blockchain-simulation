export enum Protocol {
    LongestChain,
    GHOST
}

export const DAY_STEPS = 10;
export const MONTH_STEPS = DAY_STEPS * 30;
export const YEAR_STEPS = MONTH_STEPS * 12;

export class TimePeriod {
  public static readonly STEP_INTERVAL = 1000;
  public static readonly DAY_INTERVAL = TimePeriod.STEP_INTERVAL * DAY_STEPS;
  public static readonly HOUR_INTERVAL = TimePeriod.DAY_INTERVAL / 24;
  public static readonly MONTH_INTERVAL = TimePeriod.STEP_INTERVAL * MONTH_STEPS;
}

export const LONGEST_CHAIN = "longestChain"
export const GHOST = "GHOST";
export const DEFAULT = "default";
