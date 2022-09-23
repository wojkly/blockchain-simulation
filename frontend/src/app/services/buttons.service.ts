import { Injectable } from '@angular/core';
import {interval, Observable, Subscription, tap} from "rxjs";
import {StepService} from "./step.service";
import {EventService} from "./event.service";

@Injectable({
  providedIn: 'root'
})
export class ButtonsService {
  static readonly DEFAULT_INTERVAL = 1000;

  interval: Subscription | undefined;
  interval2: Subscription | undefined;

  constructor(private eventService: EventService,
              private stepService: StepService) { }

  public startSimulation(speed: number) {
    //emit step
    this.interval?.unsubscribe();
    this.interval = interval(ButtonsService.DEFAULT_INTERVAL / speed)
      .pipe(
        tap(() => {
          this.stepService.emitStep();
        })
      ).subscribe();

    //emit block mined
    this.interval2?.unsubscribe();
    this.interval2 = interval(ButtonsService.DEFAULT_INTERVAL / speed * 20)
      .pipe(
        tap(() => {
          this.eventService.emitBlockMined();
        })
      ).subscribe();
  }

  public stopSimulation() {
    this.interval?.unsubscribe();
    this.interval2?.unsubscribe();
  }
}
