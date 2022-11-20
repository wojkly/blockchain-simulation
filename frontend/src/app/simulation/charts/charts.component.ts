import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {

  public chart: any;
  public chart2: any;

  constructor() { }

  ngOnInit(): void {
    this.createCharts();
  }

  createCharts(){

    this.chart = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['0', '1', '2','3',
          '4', '5', '6','7' ],
        datasets: [
          {
            label: "Poland",
            data: ['5','8', '9', '12', '16',
              '10', '12', '8'],
            backgroundColor: '#302474'
          },
          {
            label: "Romania",
            data: ['5', '6', '8', '10', '17',
              '15', '18', '20'],
            backgroundColor: '#603494'
          },
          {
            label: "Spain",
            data: ['2','6', '5', '7', '9',
              '7', '11', '12'],
            backgroundColor: '#6864bc'
          },
          {
            label: "Germany",
            data: ['1','6', '4', '3', '2',
              '4', '5', '4'],
            backgroundColor: '#a094cc'
          },
          {
            label: "Great Britain",
            data: ['1','7', '5', '17', '7',
              '4', '8', '3'],
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

    this.chart2 = new Chart("MyChart2", {
      type: 'line',
      data: {
        datasets: [{
          label: 'Miners Amount',
          data: [17, 20, 31, 50, 46, 35, 29, 49],
          backgroundColor: "#6864bc",
          borderColor: "#302474",
          fill: true,
        }],
        labels: ['0', '1', '2','3', '4', '5', '6','7' ]
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
}
