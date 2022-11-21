import { Component, OnInit } from '@angular/core';
import {TimerService} from "../../services/timer.service";
import {tap} from "rxjs";
import {ChartDataService} from "../../services/chart-data.service";
import {DAY_STEPS} from "../../utils/constants";

@Component({
  selector: 'app-simulation-timer',
  templateUrl: './simulation-timer.component.html',
  styleUrls: ['./simulation-timer.component.scss']
})
export class SimulationTimerComponent implements OnInit {

  stepCounter: number = 0;
  monthCounter: number = -1;

  constructor(
    private timerService: TimerService,
    private chartDataService: ChartDataService,
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
      console.log(newMonthCounter);
      this.monthCounter = newMonthCounter;
      this.chartDataService.emitRequest();
    }
  }
}
