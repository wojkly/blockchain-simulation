import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {MONTH_NUMBER} from "../utils/constants";

export class CountryData {
  constructor(
    public readonly romania: string[],
    public readonly poland: string[],
    public readonly spain: string[],
    public readonly germany: string[],
    public readonly greatBritain: string[],
  ) {
  }

  pushData(data: CountryDataSingleMonth): void {
    this.romania.push(data.romania);
    this.poland.push(data.poland);
    this.spain.push(data.spain);
    this.germany.push(data.germany);
    this.greatBritain.push(data.greatBritain);

    if(this.romania.length > MONTH_NUMBER) {
      this.romania.shift();
      this.poland.shift();
      this.spain.shift();
      this.germany.shift();
      this.greatBritain.shift();
    }
  }
}

export class CountryDataSingleMonth {
  constructor(
    public readonly romania: string,
    public readonly poland: string,
    public readonly spain: string,
    public readonly germany: string,
    public readonly greatBritain: string,
  ) {
  }

  getInitialData(): [string][] {
    return [
      [this.romania],
      [this.poland],
      [this.spain],
      [this.germany],
      [this.greatBritain]
    ];
  }
}

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {

  private dataEmitter$ = new BehaviorSubject<{total: string[], country: CountryData | null}>({total: [], country: null});

  private requestEmitter$ = new BehaviorSubject<null>(null);

  private totalData: string[] = [];
  private countryData: CountryData | null = null;

  constructor() { }

  public emitData() {
    this.dataEmitter$.next({
      total: this.totalData,
      country: this.countryData
    });
  }

  public getData() {
    return this.dataEmitter$.asObservable();
  }

  public emitRequest() {
    this.requestEmitter$.next(null);
  }

  public getRequest() {
    return this.requestEmitter$.asObservable();
  }

  public addData(total: string, byCountry: CountryDataSingleMonth) {
    this.totalData.push(total);
    if (this.totalData.length > MONTH_NUMBER)
      this.totalData.shift();

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
}
