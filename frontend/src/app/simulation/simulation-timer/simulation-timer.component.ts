import { Component, OnInit } from '@angular/core';
import {TimerService} from "../../services/timer.service";
import {tap} from "rxjs";
import {ChartDataService} from "../../services/chart-data.service";

@Component({
  selector: 'app-simulation-timer',
  templateUrl: './simulation-timer.component.html',
  styleUrls: ['./simulation-timer.component.scss']
})
export class SimulationTimerComponent implements OnInit {

  stepCounter: number = 0;

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
    if (this.stepCounter % 30 === 1) {
      this.chartDataService.emitRequest();
    }
  }
}
