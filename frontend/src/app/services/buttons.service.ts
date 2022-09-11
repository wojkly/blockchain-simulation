import { Injectable } from '@angular/core';
import {interval, Observable, Subscription, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ButtonsService {
  interval: Subscription | undefined;

  constructor() { }

  public startSimulation() {
    this.interval?.unsubscribe();
    this.interval = interval(1000)
      .pipe(
        tap(() => console.log("step"))
      ).subscribe();
  }
  public speedUpSimulation() {
    this.interval?.unsubscribe();
    this.interval = interval(500)
      .pipe(
        tap(() => console.log("step speeded up"))
      ).subscribe();
  }
  public stopSimulation() {
    this.interval?.unsubscribe();
  }
}
