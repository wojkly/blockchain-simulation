import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import {ChartDataService, CountryData} from "../../services/chart-data.service";
import {tap} from "rxjs";

export const MONTH_NUMBER = 12;


@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {

  public chartByCountry: any;
  public chartTotal: any;

  constructor(
    private chartDataService: ChartDataService,
  ) { }

  ngOnInit(): void {
    this.chartDataService.getData().pipe(
      tap(data => {
        this.createCharts(data);
        console.log(data);
      })
    ).subscribe();
  }

  createCharts(data: {total: string[], country: CountryData | null}){

    this.chartByCountry = new Chart("chartByCountry", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: this.generateLabels(),
        datasets: [
          {
            label: "Poland",
            data: data.country?.poland,
            backgroundColor: '#302474'
          },
          {
            label: "Romania",
            data: data.country?.romania,
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
