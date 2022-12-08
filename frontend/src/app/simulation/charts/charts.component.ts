import { Component, OnInit } from '@angular/core';
import {MinersAmountChartService} from "../../services/charts/miners-amount-chart.service";
import {MeanMoneyChartService} from "../../services/charts/mean-money-chart.service";

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  providers: [
    {provide: MeanMoneyChartService},
    {provide: MinersAmountChartService}
  ]
})
export class ChartsComponent implements OnInit {

  constructor(
    public minersAmountChartService: MinersAmountChartService,
    public meanMoneyChartService: MeanMoneyChartService
  ) { }

  ngOnInit(): void {
  }

}
