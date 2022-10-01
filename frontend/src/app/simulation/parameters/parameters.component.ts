import {Component, OnInit} from '@angular/core';
import {MatSliderChange} from "@angular/material/slider";
import {ParametersService} from "../../services/parameters.service";

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss']
})
export class ParametersComponent implements OnInit {

  electricityPrice: any;
  frequency: any;
  reward: number | null = 0;

  constructor(
    public parametersService: ParametersService) {
  }

  ngOnInit(): void {
    this.setSliders();
  }

  setSliders(){
    this.electricityPrice = this.parametersService.getElectricityPrice();
    this.frequency = this.parametersService.getFrequency();
    this.reward = this.parametersService.getReward();
  }

  onElectricityPriceChange(event: MatSliderChange) {
    this.parametersService.setElectricityPrice(event.value);
    this.electricityPrice = event.value;
  }

  onFrequencyChange(event: MatSliderChange) {
    this.parametersService.setFrequency(event.value);
    this.frequency = event.value;
  }

  onRewardChange(event: MatSliderChange) {
    this.parametersService.setReward(event.value);
    this.reward = event.value;
  }

}
