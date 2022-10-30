import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {SimulationService} from "../../services/simulation.service";
import {Node} from "../model/node";
import {catchError, of, tap} from "rxjs";
import {MinerService} from "../../services/miner.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-miners',
  templateUrl: './miners.component.html',
  styleUrls: ['./miners.component.scss']
})
export class MinersComponent implements AfterViewInit {

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  minerList = new MatTableDataSource<Node>();
  displayedColumns = ['id', 'money', 'power', 'mined', 'length']

  constructor(
    private simulationService: SimulationService,
    private minerService: MinerService
  ) {
    this.minerList.data = this.simulationService.getMiners();
  }

  ngAfterViewInit() {
    this.minerList.paginator = this.paginator;
    this.minerList.sort = this.sort;
    this.getData();
  }

  getData(): void {
    this.minerService.get()
      .pipe(
        tap( () => {
          this.minerList.data = this.simulationService.getMiners();
        }),
        catchError(err => {
          console.log(err.error.error);
          return of({});
        })
      ).subscribe();
  }
}
