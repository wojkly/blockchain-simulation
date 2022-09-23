import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Graph} from "../simulation/model/graph";

@Injectable({
  providedIn: 'root'
})
export class StepService {
  private step = new BehaviorSubject<string>('');

  private stepSemaphore = false;

  constructor() { }

  public getStep(): Observable<string> {
    return this.step.asObservable();
  }

  public emitStep() {
    if (this.stepSemaphore) {
      this.blockSemaphore();
      this.step.next('');
    }
  }

  public unblockSemaphore() {
    this.stepSemaphore = true;
  }
  public blockSemaphore() {
    this.stepSemaphore = false;
  }
}
