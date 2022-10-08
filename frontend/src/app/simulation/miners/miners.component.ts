import { Component, OnInit } from '@angular/core';
import {SimulationService} from "../../services/simulation.service";
import {Node} from "../model/node";
import {catchError, of, tap} from "rxjs";
import {MinerService} from "../../services/miner.service";
import {defaultLogger} from "@angular/cdk/schematics/update-tool/logger";

@Component({
  selector: 'app-miners',
  templateUrl: './miners.component.html',
  styleUrls: ['./miners.component.scss']
})
export class MinersComponent implements OnInit {

  minerList: Node[];
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
        }),
        catchError(err => {
          console.log(err.error.error);
          return of({});
        })
      ).subscribe();
  }
}
