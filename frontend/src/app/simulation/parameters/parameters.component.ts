import {Component, OnInit} from '@angular/core';
import {MatSliderChange} from "@angular/material/slider";
import {ParametersService} from "../../services/parameters.service";

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss']
})
export class ParametersComponent implements OnInit {

  electricityPrice: number | null = 1;
  frequency: number | null = 1;
  reward: number | null = 5;

  constructor(
    public parametersService: ParametersService) {
  }

  ngOnInit(): void {
    this.setSliders();
  }

  setSliders(){
    this.electricityPrice = this.parametersService.getElectricityPrice();
    this.reward = this.parametersService.getReward();
  }

  onElectricityPriceChange(event: MatSliderChange) {
    this.parametersService.setElectricityPrice(event.value);
    this.electricityPrice = event.value;
  }

  onFrequencyChange(event: MatSliderChange) {
    this.parametersService.emitAddNewMinerFrequency(event.value);
    this.frequency = event.value;
  }

  onRewardChange(event: MatSliderChange) {
    this.parametersService.setReward(event.value);
    this.reward = event.value;
  }

}
