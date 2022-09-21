import { Component, OnInit } from '@angular/core';
import {ButtonsService} from "../../services/buttons.service";

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit {
  disabled = false;
  value = 1;

  constructor(private readonly buttonsService: ButtonsService) { }

  ngOnInit(): void {
  }

  startSimulation(){
    this.disabled = true;
    this.buttonsService.startSimulation(this.value);
  }

  stopSimulation(){
    this.buttonsService.stopSimulation();
    this.disabled = false;
  }

}
