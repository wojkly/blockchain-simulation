import {Component, OnDestroy, OnInit} from '@angular/core';
import Chart from 'chart.js/auto';
import {ChartDataService, CountryData} from "../../services/chart-data.service";
import {tap} from "rxjs";
import {MONTH_NUMBER} from "../../utils/constants";


@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit, OnDestroy {

  public chartByCountry: any;
  public chartTotal: any;

  private subscriber: any;

  constructor(
    private chartDataService: ChartDataService,
  ) { }

  ngOnInit(): void {
    this.subscriber = this.chartDataService.getData().pipe(
      tap(data => {
        if (this.chartByCountry)
          this.chartByCountry.destroy();
        if(this.chartTotal)
          this.chartTotal.destroy();

        this.createCharts(data);
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

  createCharts(data: {total: string[], country: CountryData | null}){

    this.chartByCountry = new Chart("chartByCountry", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: this.generateLabels(),
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
        labels: this.generateLabels()
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

  private generateLabels(): string[] {
    let res: string[] = [];
    for(let i = 1; i <= MONTH_NUMBER; i++) {
      res.push(i.toString());
    }
    return res;
  }
}
