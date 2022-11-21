import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {MONTH_NUMBER} from "../simulation/charts/charts.component";

export class CountryData {
  constructor(
    public readonly poland: string[],
    public readonly romania: string[],
    public readonly spain: string[],
    public readonly germany: string[],
    public readonly greatBritain: string[],
  ) {
  }

  pushData(data: CountryDataSingleMonth): void {
    this.poland.push(data.poland);
    this.romania.push(data.romania);
    this.spain.push(data.spain);
    this.germany.push(data.germany);
    this.greatBritain.push(data.greatBritain);

    if(this.poland.length > MONTH_NUMBER) {
      this.poland.shift();
      this.romania.shift();
      this.spain.shift();
      this.germany.shift();
      this.greatBritain.shift();
    }
  }
}

export class CountryDataSingleMonth {
  constructor(
    public readonly poland: string,
    public readonly romania: string,
    public readonly spain: string,
    public readonly germany: string,
    public readonly greatBritain: string,
  ) {
  }

  getInitialData(): [string][] {
    return [
      [this.poland],
      [this.romania],
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

  private totalDataEmitter$ = new BehaviorSubject<string[]>([]);
  private countryDataEmitter$ = new BehaviorSubject<CountryData>([]);

  private totalData: string[] = [];
  private countryData: CountryData | null = null;

  constructor() { }

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
