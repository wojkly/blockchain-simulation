// data collector by country
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


// single month data by country
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
