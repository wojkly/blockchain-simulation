import { Component, OnInit } from '@angular/core';
import {SimulationService} from "../../services/simulation.service";
import {MinerNode} from "../model/miner-node";
import {MinersService} from "../../services/miners.service";
import {catchError, of, tap} from "rxjs";

@Component({
  selector: 'app-miners',
  templateUrl: './miners.component.html',
  styleUrls: ['./miners.component.scss']
})
export class MinersComponent implements OnInit {

  minerList: MinerNode[];
  displayedColumns = ['id', 'money', 'mined', 'length']

  constructor(
    private simulationService: SimulationService,
    private minersService: MinersService
  ) {
    this.minerList = Array.from(this.simulationService.getMiners());
  }

  ngOnInit(): void {
    this.minersService.get()
      .pipe(
        tap( () => {
          this.minerList = Array.from(this.simulationService.getMiners());
          console.log(this.minerList);
        }),
        catchError(err => {
          console.log(err.error.error);
          return of({});
        })
      ).subscribe();
  }

}
