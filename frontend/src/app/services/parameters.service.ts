import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ParametersService {
  minerNodes = 10;

  public getMinerNodes(): number {
    return this.minerNodes;
  }


  public setMinerNodes(value: number): void {
    this.minerNodes = value;
  }

  constructor() { }
}
