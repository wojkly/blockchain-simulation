import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Graph} from "../simulation/model/graph";

@Injectable({
  providedIn: 'root'
})
export class StepService {
  private step = new BehaviorSubject<string>('');

  constructor() { }

  public getStep(): Observable<string> {
    return this.step.asObservable();
  }

  public emitStep() {
    // console.log('step.next')
    this.step.next('');
  }
}
