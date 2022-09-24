import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {MatSliderChange} from "@angular/material/slider";

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

  setPrice(value: any) {
    this.price = value;
  }

  setFrequency(value: any) {
    this.frequency = value;
  }

  setAward(value: any) {
    this.award = value;
  }


}
