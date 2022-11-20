import { Injectable } from '@angular/core';
import {interval, Observable, Subscription, tap} from "rxjs";
import {StepService} from "./step.service";
import {EventService} from "./event.service";
import {PaymentService} from "./payment.service";
import {AddMinerService} from "./add-miner.service";
import {TimerService} from "./timer.service";
import {TimePeriod} from "../utils/constants";

@Injectable({
  providedIn: 'root'
})
export class ButtonsService {

  interval: Subscription | undefined;
  interval2: Subscription | undefined;
  interval3: Subscription | undefined;
  interval4: Subscription | undefined;

  constructor(private eventService: EventService,
              private stepService: StepService,
              private paymentService: PaymentService,
              private addMinerService: AddMinerService,
              private timerService: TimerService,
              ) { }

  public startSimulation(simulationSpeed: number) {
    //emit step
    this.interval?.unsubscribe();
    this.interval = interval(TimePeriod.STEP_INTERVAL / simulationSpeed)
      .pipe(
        tap(() => {
          this.stepService.emitStep();
          this.timerService.emitUpdateTime();
        })
      ).subscribe();

    //emit block mined
    this.interval2?.unsubscribe();
    this.interval2 = interval(TimePeriod.DAY_INTERVAL / simulationSpeed)
      .pipe(
        tap(() => {
          this.eventService.emitBlockMined();
        })
      ).subscribe();

    //emit money removal
    this.interval3?.unsubscribe();
    this.interval3 = interval(TimePeriod.MONTH_INTERVAL / simulationSpeed)
      .pipe(
        tap(() => {
          this.paymentService.emitPayment();
        })
      ).subscribe();

    // emit blockchain update
    this.interval4?.unsubscribe();
    this.interval4 = interval(TimePeriod.DAY_INTERVAL / simulationSpeed)
      .pipe(
        tap(() => {
          this.eventService.emitBlockchainUpdate();
        })
      ).subscribe();


    //emit create new miner
    this.addMinerService.emitStart(simulationSpeed);
  }

  public stopSimulation() {
    this.interval?.unsubscribe();
    this.interval2?.unsubscribe();
    this.interval3?.unsubscribe();
    this.addMinerService.emitStop();
  }
}
