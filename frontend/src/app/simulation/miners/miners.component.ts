import {AfterViewInit, Component, OnDestroy, ViewChild} from '@angular/core';
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
import {MatDialog} from "@angular/material/dialog";
import {EditMinerComponent} from "./edit-miner/edit-miner.component";
import {VisualisationService} from "../../services/visualisation.service";
import {AddMinerComponent} from "./add-miner/add-miner.component";

@Component({
  selector: 'app-miners',
  templateUrl: './miners.component.html',
  styleUrls: ['./miners.component.scss']
})
export class MinersComponent implements AfterViewInit, OnDestroy {
  @ViewChild('activeMinersPaginator', { static: false }) activeMinersPaginator!: MatPaginator;
  @ViewChild('deadMinersPaginator', { static: false }) deadMinersPaginator!: MatPaginator;
  @ViewChild('activeMinersSort', { static: false }) activeMinersSort!: MatSort;
  @ViewChild('deadMinersSort', { static: false }) deadMinersSort!: MatSort;

  minerList = new MatTableDataSource<Node>();
  deadMinerList = new MatTableDataSource<Node>();
  displayedColumns = ['id', 'money', 'power', 'mined', 'country', 'electricity', 'edit'];
  displayedColumnsWithoutEdit = ['id', 'money', 'power', 'mined', 'country', 'electricity'];

  private minerDataSub: any;
  private deadMinerDataSub: any;


  constructor(
    private simulationService: SimulationService,
    private minerService: MinerService,
    private parametersService: ParametersService,
    private minersDeletingService: MinersDeletingService,
    private dialog: MatDialog,
    private visualizationService: VisualisationService
  ) {
    this.minerList.data = this.simulationService.getMiners();
    this.deadMinerList.data = this.simulationService.deadMiners;
  }

  ngOnDestroy(): void {
    this.minerDataSub.unsubscribe();
    this.deadMinerDataSub.unsubscribe();
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
    if(this.minerDataSub)
      this.minerDataSub.unsubscribe();

    this.minerDataSub = this.minerService.get()
      .pipe(
        tap( () => {
          this.minerList.data = this.simulationService.getMiners();
          this.deadMinerList.data = this.simulationService.deadMiners;
        }),
        catchError(err => {
          console.log(err.error.error);
          return of({});
        })
      ).subscribe();
  }

  getDeadMinersData(): void {
    if(this.deadMinerDataSub)
      this.deadMinerDataSub.unsubscribe();

    this.deadMinerDataSub = this.minersDeletingService.getMinersToDelete()
      .pipe(
        tap( () => {
          this.deadMinerList.data = this.simulationService.deadMiners;
        }),
        catchError(err => {
          console.log(err.error.error);
          return of({});
        })
      ).subscribe();
  }

  edit(miner: Node){
    const dialogRef = this.dialog.open(EditMinerComponent, {
      width: '700px',
      data: {
        miner: miner
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if(res){
        this.visualizationService.emitGraph(res);
      }
    });
  }

  addMiner(){
    const dialogRef = this.dialog.open(AddMinerComponent, {
      width: '700px',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if(res){
        for(var i = 0; i < res.length; i++){
          this.simulationService.addNewMinerWithParams(res[i].country, res[i].money, res[i].power)
        }
        this.getData();
        this.getDeadMinersData();
      }
    });
  }
}
