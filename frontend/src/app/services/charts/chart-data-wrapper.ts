import {CountryData} from "./country-data-classes";

export class ChartDataWrapper {
  constructor(
    public total: string[],
    public country: CountryData | null,
    public monthNumber: number
  ) {
  }
}
