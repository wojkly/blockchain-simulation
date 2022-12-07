import { Component, OnInit } from '@angular/core';
import {TimerService} from "../../services/timer.service";
import {tap} from "rxjs";
import {MinersAmountChartService} from "../../services/charts/miners-amount-chart.service";
import {DAY_STEPS} from "../../utils/constants";
import {MeanMoneyChartService} from "../../services/charts/mean-money-chart.service";

@Component({
  selector: 'app-simulation-timer',
  templateUrl: './simulation-timer.component.html',
  styleUrls: ['./simulation-timer.component.scss']
})
export class SimulationTimerComponent implements OnInit {

  stepCounter: number = 0;
  monthCounter: number = 0;

  constructor(
    private timerService: TimerService,
    private minersAmountChartService: MinersAmountChartService,
    private meanMoneyChartService: MeanMoneyChartService
  ) { }

  ngOnInit(): void {
    this.timerService.getUpdateTime().pipe(
      tap(() => this.updateSimulationTimer())
    ).subscribe();
  }

  private updateSimulationTimer() {
    this.stepCounter ++;
    const newMonthCounter = Math.floor(Math.floor(this.stepCounter / DAY_STEPS) / 30);
    if (this.monthCounter !== newMonthCounter) {
      this.monthCounter = newMonthCounter;
      this.minersAmountChartService.emitRequest(this.monthCounter);
      this.meanMoneyChartService.emitRequest(this.monthCounter);
    }
  }
}
