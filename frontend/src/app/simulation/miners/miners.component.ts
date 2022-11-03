import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {SimulationService} from "../../services/simulation.service";
import {Node} from "../model/node";
import {catchError, of, tap} from "rxjs";
import {MinerService} from "../../services/miner.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {getCountryNameByEnumName, getPriceByEnumName} from "../model/country";
import {ParametersService} from "../../services/parameters.service";

@Component({
  selector: 'app-miners',
  templateUrl: './miners.component.html',
  styleUrls: ['./miners.component.scss']
})
export class MinersComponent implements AfterViewInit {

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  minerList = new MatTableDataSource<Node>();
  displayedColumns = ['id', 'money', 'power', 'mined', 'length', 'country', 'electricity']

  constructor(
    private simulationService: SimulationService,
    private minerService: MinerService,
    private parametersService: ParametersService
  ) {
    this.minerList.data = this.simulationService.getMiners();
  }

  ngAfterViewInit() {
    this.minerList.paginator = this.paginator;
    this.minerList.sort = this.sort;
    this.getData();
  }

  calculateElectricity(country: string){
    return getPriceByEnumName(country) * this.parametersService.getElectricityPrice();
  }

  getCountryName(country: string){
    return getCountryNameByEnumName(country);
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
