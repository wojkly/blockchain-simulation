import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private readonly updateTimer$ = new BehaviorSubject<null>(null);

  constructor() { }

  public emitUpdateTime() {
    this.updateTimer$.next(null);
  }

  public getUpdateTime(): Observable<null> {
    return  this.updateTimer$.asObservable();
  }
}
