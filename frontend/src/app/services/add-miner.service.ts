import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AddMinerService {
  private addMiner$ = new BehaviorSubject<number>(-1);

  constructor() {
  }

  public getAddMiner() {
    return this.addMiner$.asObservable();
  }

  public emitStart(simulationSpeed: number) {
    this.addMiner$.next(simulationSpeed);
  }
  public emitStop() {
    this.addMiner$.next(-1);
  }
}
