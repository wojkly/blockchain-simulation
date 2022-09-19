import { Injectable } from '@angular/core';
import {interval, Observable, Subscription, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ButtonsService {
  static readonly DEFAULT_INTERVAL = 1000;

  interval: Subscription | undefined;

  constructor() { }

  public startSimulation(speed: number) {
    this.interval?.unsubscribe();
    this.interval = interval(ButtonsService.DEFAULT_INTERVAL / speed)
      .pipe(
        tap(() => console.log("step interval: " + ButtonsService.DEFAULT_INTERVAL / speed))
      ).subscribe();
  }

  public stopSimulation() {
    this.interval?.unsubscribe();
  }
}
