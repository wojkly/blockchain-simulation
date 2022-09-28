import { Component, OnInit } from '@angular/core';
import {SimulationService} from "../../services/simulation.service";
import {MinerNode} from "../model/miner-node";
import {catchError, of, tap} from "rxjs";
import {MinerService} from "../../services/miner.service";

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
    private minerService: MinerService
  ) {
    this.minerList = this.simulationService.getMiners();
  }

  ngOnInit(): void {
    this.minerService.get()
      .pipe(
        tap( () => {
          this.minerList = this.simulationService.getMiners();
          console.log(this.minerList);
        }),
        catchError(err => {
          console.log(err.error.error);
          return of({});
        })
      ).subscribe();
  }
}
