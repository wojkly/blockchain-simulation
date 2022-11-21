import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {MONTH_NUMBER} from "../simulation/charts/charts.component";

export class MinerDataByCountry {
  constructor(
    public readonly poland: string,
    public readonly romania: string,
    public readonly spain: string,
    public readonly germany: string,
    public readonly greatBritain: string,
  ) {
  }
}

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {

  private totalDataEmitter$ = new BehaviorSubject<string[]>([]);
  private countryDataEmitter$ = new BehaviorSubject<MinerDataByCountry[]>([]);

  private totalData: number[] = [];
  private countryData: MinerDataByCountry[] = [];

  constructor() { }

  public addData(total: number, byCountry: MinerDataByCountry) {
    this.totalData.push(total);
    if (this.totalData.length > MONTH_NUMBER)
      this.totalData.shift();

    this.countryData.push(byCountry);
    if (this.countryData.length > MONTH_NUMBER)
      this.countryData.shift();
  }
}
