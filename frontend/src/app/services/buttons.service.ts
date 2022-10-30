import { Injectable } from '@angular/core';
import {interval, Observable, Subscription, tap} from "rxjs";
import {StepService} from "./step.service";
import {EventService} from "./event.service";
import {PaymentService} from "./payment.service";
import {AddMinerService} from "./add-miner.service";

@Injectable({
  providedIn: 'root'
})
export class ButtonsService {
  static readonly DEFAULT_INTERVAL = 1000;

  interval: Subscription | undefined;
  interval2: Subscription | undefined;
  interval3: Subscription | undefined;

  constructor(private eventService: EventService,
              private stepService: StepService,
              private paymentService: PaymentService,
              private addMinerService: AddMinerService,) { }

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

    //emit money removal
    this.interval3?.unsubscribe();
    this.interval3 = interval(ButtonsService.DEFAULT_INTERVAL / speed * 10)
      .pipe(
        tap(() => {
          this.paymentService.emitPayment();
        })
      ).subscribe();


    //emit create new miner
    this.addMinerService.emitStart();
  }

  public stopSimulation() {
    this.interval?.unsubscribe();
    this.interval2?.unsubscribe();
    this.interval3?.unsubscribe();
    this.addMinerService.emitStop();
  }
}
