import {Component, OnDestroy, OnInit} from '@angular/core';
import Chart from 'chart.js/auto';
import {MinersAmountChartService, CountryData} from "../../services/charts/miners-amount-chart.service";
import {Subscription, tap} from "rxjs";
import {FormControl} from "@angular/forms";


@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit, OnDestroy {

  public chartByCountry: any;
  public chartTotal: any;

  private minersAmountSubscriber;
  private meanMoneySubscriber;
  public numOfMonths: number = 1;

  selectedNumOfMonthsForCountryChart: FormControl = new FormControl(6);
  selectedNumOfMonthsForTotalChart: FormControl = new FormControl(6);

  chartsData: { total: string[]; country: CountryData | null, monthNumber: number } = {
    total: [],
    country: null,
    monthNumber: 1
  };


  constructor(
    private minersAmountChartService: MinersAmountChartService
  ) { }

  ngOnInit(): void {
    this.minersAmountSubscriber = this.minersAmountChartService.getData().pipe(
      tap(data => {
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
    this.minersAmountSubscriber.unsubscribe();
  }

  createCharts(data: {total: string[], country: CountryData | null}){
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

  private createCountryChart(data: { total: string[]; country: CountryData | null }) {
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

  private createTotalChart(data: { total: string[]; country: CountryData | null }) {
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
