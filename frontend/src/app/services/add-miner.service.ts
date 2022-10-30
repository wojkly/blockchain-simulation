import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AddMinerService {
  private addMiner$ = new BehaviorSubject<boolean>(false);

  constructor() {
  }

  public getAddMiner() {
    return this.addMiner$.asObservable();
  }

  public emitStart() {
    this.addMiner$.next(true);
  }
  public emitStop() {
    this.addMiner$.next(false);
  }
}
