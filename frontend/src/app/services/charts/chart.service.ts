import {CountryData, CountryDataSingleMonth} from "./country-data-classes";
import {Observable} from "rxjs";
import {ChartDataWrapper} from "./chart-data-wrapper";

export interface ChartService {

  getTotalChartTitle(): string;

  getCountryChartTitle(): string;

  getYAxisLabel(): string;

  getXAxisLabel(): string;

  getCountryChartId(): string;

  getTotalChartId(): string;

  emitData(): void;

  getData(): Observable<ChartDataWrapper>;

  addData(total: string, byCountry: CountryDataSingleMonth, monthNumber: number): void;
}
