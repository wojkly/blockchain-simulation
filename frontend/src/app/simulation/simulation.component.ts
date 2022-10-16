import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BLOCKCHAIN_PATH, MINERS_PATH, NETWORK_PATH, PARAMETERS_PATH} from "../app-routing-paths";
import {ParametersService} from "../services/parameters.service";
import {Tab} from "./tab";
import {SimulationService} from "../services/simulation.service";

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit {
  nodesCount: number = 10;

  tabs: Tab[] = [
    new Tab('Network', NETWORK_PATH),
    new Tab('Miners', MINERS_PATH),
    new Tab('Parameters', PARAMETERS_PATH),
    new Tab('Blockchain', BLOCKCHAIN_PATH)
  ];

  constructor(private activatedRoute: ActivatedRoute,
              private parametersService: ParametersService,
              private simulationService: SimulationService) { }

  ngOnInit(): void {
    this.nodesCount = this.parametersService.getAllNodes();
    this.simulationService.initializeSimulation();
  }

}
