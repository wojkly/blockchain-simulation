import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

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

  private dataEmitter$ = new BehaviorSubject<{total: string[], country: CountryData | null, monthNumber: number}>({total: [], country: null, monthNumber: 1});

  private requestEmitter$ = new BehaviorSubject<number>(1);

  private totalData: string[] = [];
  private countryData: CountryData | null = null;
  private monthNumber: number = 1;

  constructor() { }

  public emitData() {
    this.dataEmitter$.next({
      total: this.totalData,
      country: this.countryData,
      monthNumber: this.monthNumber
    });
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
}
