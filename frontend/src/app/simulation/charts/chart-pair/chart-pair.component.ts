import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import Chart from 'chart.js/auto';
import {MinersAmountChartService} from "../../../services/charts/miners-amount-chart.service";
import {tap} from "rxjs";
import {FormControl} from "@angular/forms";
import {MeanMoneyChartService} from "../../../services/charts/mean-money-chart.service";
import {ChartDataWrapper} from "../../../services/charts/chart-data-wrapper";


@Component({
  selector: 'app-chart-pair',
  templateUrl: './chart-pair.component.html',
  styleUrls: ['./chart-pair.component.scss']
})
export class ChartPairComponent implements OnInit, OnDestroy {
  @Input() chartService: any;

  public chartByCountry: any;
  public chartTotal: any;

  private dataSubscriber;
  public numOfMonths: number = 1;

  selectedNumOfMonthsForCountryChart: FormControl = new FormControl(6);
  selectedNumOfMonthsForTotalChart: FormControl = new FormControl(6);

  chartsData: ChartDataWrapper = new ChartDataWrapper([], null, 1);


  constructor() {
  }

  ngOnInit(): void {
    this.dataSubscriber = this.chartService.getData().pipe(
      tap((data: ChartDataWrapper) => {
        if (this.chartByCountry)
          this.chartByCountry.destroy();
        if(this.chartTotal)
          this.chartTotal.destroy();
        this.chartsData = data;
        this.numOfMonths = data.monthNumber + 1;
        this.createCharts(data);
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.dataSubscriber.unsubscribe();
  }

  createCharts(data: ChartDataWrapper){
    this.createCountryChart(data);
    this.createTotalChart(data);
  }

  changeLabelForCountryChart(){
    this.chartByCountry.destroy();
    this.createCountryChart(this.chartsData);
  }

  changeLabelForTotalChart(){
    this.chartTotal.destroy();
    this.createTotalChart(this.chartsData);
  }

  private generateLabelsForCountryChart(): string[] {
    let res: string[] = [];
    if(this.selectedNumOfMonthsForCountryChart.value == "all"){
      for(let i = 0; i < this.numOfMonths; i++) {
        res.push(i.toString());
      }
    }
    else if(this.numOfMonths > this.selectedNumOfMonthsForCountryChart.value) {
      for (let i = this.numOfMonths - this.selectedNumOfMonthsForCountryChart.value; i < this.numOfMonths; i++) {
        res.push(i.toString());
      }
    }
    else{
      for(let i = 0; i < this.selectedNumOfMonthsForCountryChart.value; i++) {
        res.push(i.toString());
      }
    }
    return res;
  }

  private generateLabelsForTotalChart(): string[] {
    let res: string[] = [];
    if(this.selectedNumOfMonthsForTotalChart.value == "all"){
      for(let i = 0; i < this.numOfMonths; i++) {
        res.push(i.toString());
      }
    }
    else if(this.numOfMonths > this.selectedNumOfMonthsForTotalChart.value)
      for(let i = this.numOfMonths - this.selectedNumOfMonthsForTotalChart.value; i < this.numOfMonths; i++) {
        res.push(i.toString());
      }
    else{
      for(let i = 0; i < this.selectedNumOfMonthsForTotalChart.value; i++) {
        res.push(i.toString());
      }
    }
    return res;
  }

  private createCountryChart(data: ChartDataWrapper) {
    this.chartByCountry = new Chart("chartByCountry", {
      type: 'bar',

      data: {
        labels: this.generateLabelsForCountryChart(),
        datasets: [
          {
            label: "Romania",
            data: data.country?.romania,
            backgroundColor: '#302474'
          },
          {
            label: "Poland",
            data: data.country?.poland,
            backgroundColor: '#603494'
          },
          {
            label: "Spain",
            data: data.country?.spain,
            backgroundColor: '#6864bc'
          },
          {
            label: "Germany",
            data: data.country?.germany,
            backgroundColor: '#a094cc'
          },
          {
            label: "Great Britain",
            data: data.country?.greatBritain,
            backgroundColor: '#b8bcf4'
          },
        ]
      },
      options: {
        aspectRatio:2.5,
        responsive: true,
        scales: {
          y: {
            title:{
              display: true,
              text: 'Miners amount'
            }
          },
          x: {
            title:{
              display: true,
              text: 'Months'
            }
          }
        }
      }

    });
  }

  private createTotalChart(data: ChartDataWrapper) {
    this.chartTotal = new Chart("chartTotal", {
      type: 'line',
      data: {
        datasets: [{
          label: 'Miners Amount',
          data: data.total,
          backgroundColor: "#6864bc",
          borderColor: "#302474",
          fill: true,
        }],
        labels: this.generateLabelsForTotalChart()
      },
      options: {
        aspectRatio: 2.5,
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: 'Miners amount'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Months'
            }
          }
        }
      }
    });
  }
}
