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
import {MinersDeletingService} from "../../services/miners-deleting.service";

@Component({
  selector: 'app-miners',
  templateUrl: './miners.component.html',
  styleUrls: ['./miners.component.scss']
})
export class MinersComponent implements AfterViewInit {

  @ViewChild('activeMinersPaginator', { static: false }) activeMinersPaginator!: MatPaginator;
  @ViewChild('deadMinersPaginator', { static: false }) deadMinersPaginator!: MatPaginator;
  @ViewChild('activeMinersSort', { static: false }) activeMinersSort!: MatSort;
  @ViewChild('deadMinersSort', { static: false }) deadMinersSort!: MatSort;

  minerList = new MatTableDataSource<Node>();
  deadMinerList = new MatTableDataSource<Node>();
  displayedColumns = ['id', 'money', 'power', 'mined', 'length', 'country', 'electricity']

  constructor(
    private simulationService: SimulationService,
    private minerService: MinerService,
    private parametersService: ParametersService,
    private minersDeletingService: MinersDeletingService,
  ) {
    this.minerList.data = this.simulationService.getMiners();
    this.deadMinerList.data = this.simulationService.deadMiners;
  }

  ngAfterViewInit() {
    this.minerList.paginator = this.activeMinersPaginator;
    this.minerList.sort = this.activeMinersSort;
    this.deadMinerList.paginator = this.deadMinersPaginator;
    this.deadMinerList.sort = this.deadMinersSort;
    this.getData();
    this.getDeadMinersData();
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
          this.deadMinerList.data = this.simulationService.deadMiners;
          console.log(this.deadMinerList.data)
        }),
        catchError(err => {
          console.log(err.error.error);
          return of({});
        })
      ).subscribe();
  }

  getDeadMinersData(): void {
    this.minersDeletingService.getMinersToDelete()
      .pipe(
        tap( () => {
          this.deadMinerList.data = this.simulationService.deadMiners;
          console.log(this.deadMinerList.data)
        }),
        catchError(err => {
          console.log(err.error.error);
          return of({});
        })
      ).subscribe();
  }
}
