import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParametersService {
  minerNodes = 10;
  price: any;
  frequency: any;
  award: any;

  constructor() { }

  public getMinerNodes(): number {
    return this.minerNodes;
  }

  public setMinerNodes(value: number): void {
    this.minerNodes = value;
  }

  public setPrice(value: any): void {
    this.price = value;
  }

  public getPrice(): number {
    return this.price;
  }

  public setFrequency(value: any): void {
    this.frequency = value;
  }

  public getFrequency(): number {
    return this.frequency;
  }

  public setAward(value: any): void {
    this.award = value;
  }

  public getAward(): number {
    return this.award;
  }

}
