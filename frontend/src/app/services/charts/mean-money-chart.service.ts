import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ChartDataWrapper} from "./chart-data-wrapper";
import {CountryData, CountryDataSingleMonth} from "./country-data-classes";

@Injectable({
  providedIn: 'root'
})
export class MeanMoneyChartService {
  private dataEmitter$ = new BehaviorSubject<ChartDataWrapper>(new ChartDataWrapper([], null, 1));

  private requestEmitter$ = new BehaviorSubject<number>(1);

  private totalData: string[] = [];
  private meanMoneyByCountry: CountryData | null = null;
  private monthNumber: number = 1;

  constructor() { }

  public emitData() {
    this.dataEmitter$.next(new ChartDataWrapper(
      this.totalData,
      this.meanMoneyByCountry,
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

    if(this.meanMoneyByCountry === null) {
      const initialData = byCountry.getInitialData();
      this.meanMoneyByCountry = new CountryData(
        initialData[0],
        initialData[1],
        initialData[2],
        initialData[3],
        initialData[4])
    } else {
      this.meanMoneyByCountry.pushData(byCountry);
    }
  }
}
