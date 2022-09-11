import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {tap} from "rxjs";

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit {
  nodesCount: number = 10;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
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
