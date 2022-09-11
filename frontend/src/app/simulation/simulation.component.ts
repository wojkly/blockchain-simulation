import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {tap} from "rxjs";
import {MINERS_PATH, NETWORK_PATH, PARAMETERS_PATH} from "../app-routing-paths";
import {ParametersService} from "../services/parameters.service";
import {Tab} from "./tab";

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
  ];

  constructor(private activatedRoute: ActivatedRoute,
              private parametersService: ParametersService) { }

  ngOnInit(): void {
    //todo emit some observable to initialize graph
    //todo pass params to parameter service
    this.activatedRoute.paramMap.pipe(
      tap(m => {
        let paramValue = m.get("nodesCount");

        if (paramValue != null) {
          this.nodesCount = +paramValue;
        }
      })
    ).subscribe();
  }

}
