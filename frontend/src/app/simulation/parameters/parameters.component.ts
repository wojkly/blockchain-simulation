import {Component, OnInit} from '@angular/core';
import {MatSliderChange} from "@angular/material/slider";
import {ParametersService} from "../../services/parameters.service";

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss']
})
export class ParametersComponent implements OnInit {

  price: any;
  frequency: any;
  award: any;

  constructor(
    private readonly parametersService: ParametersService) {
  }

  ngOnInit(): void {
  }

  onPriceChange(event: MatSliderChange) {
    this.parametersService.setPrice(event.value);
  }

  onFrequencyChange(event: MatSliderChange) {
    this.parametersService.setFrequency(event.value);
  }

  onAwardChange(event: MatSliderChange) {
    this.parametersService.setAward(event.value);
  }

}
