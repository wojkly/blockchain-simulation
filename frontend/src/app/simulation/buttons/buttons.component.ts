import { Component, OnInit } from '@angular/core';
import {ButtonsService} from "../../services/buttons.service";

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit {

  constructor(private readonly buttonsService: ButtonsService) { }

  ngOnInit(): void {
  }

  startSimulation(){
    this.buttonsService.startSimulation();
  }

  speedUpSimulation(){
    this.buttonsService.speedUpSimulation();
  }

  stopSimulation(){
    this.buttonsService.stopSimulation();
  }

}
