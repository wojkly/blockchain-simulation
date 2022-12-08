import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ChartDataWrapper} from "./chart-data-wrapper";
import {CountryData, CountryDataSingleMonth} from "./country-data-classes";
import {ChartService} from "./chart.service";

@Injectable({
  providedIn: 'root'
})
export class MeanMoneyChartService implements ChartService {
  private dataEmitter$ = new BehaviorSubject<ChartDataWrapper>(new ChartDataWrapper([], null, 1));

  private requestEmitter$ = new BehaviorSubject<number>(1);

  private totalData: string[] = [];
  private countryData: CountryData | null = null;

  private monthNumber: number = 1;

  constructor() { }

  public emitData() {
    this.dataEmitter$.next(new ChartDataWrapper(
      this.totalData,
      this.countryData,
      this.monthNumber
    ));
  }

  public getData() {
    return this.dataEmitter$.asObservable();
  }

  public emitRequest(value) {
    this.requestEmitter$.next(value);
  }

  public getRequest() {
    return this.requestEmitter$.asObservable();
  }

  public addData(total: string, byCountry: CountryDataSingleMonth, monthNumber: number) {
    this.totalData.push(total);
    this.monthNumber = monthNumber;

    if(this.countryData === null) {
      const initialData = byCountry.getInitialData();
      this.countryData = new CountryData(
        initialData[0],
        initialData[1],
        initialData[2],
        initialData[3],
        initialData[4])
    } else {
      this.countryData.pushData(byCountry);
    }
  }

  getCountryChartTitle(): string {
    return 'The chart shows the average amount of money possessed by miners in each country';
  }

  getTotalChartTitle(): string {
    return 'The chart shows the overall average amount of money possessed by all miners';
  }

  getXAxisLabel(): string {
    return 'Month';
  }

  getYAxisLabel(): string {
    return 'Average amount of money [$]';
  }

  getCountryChartId(): string {
    return 'meanMoneyByCountry';
  }

  getTotalChartId(): string {
    return 'meanMoneyTotal';
  }
}
