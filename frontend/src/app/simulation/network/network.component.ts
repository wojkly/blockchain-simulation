import { Component, OnInit } from '@angular/core';
import {BehaviorSubject, buffer, bufferCount, filter, forkJoin, single, tap, zip} from "rxjs";
import {VisualisationService} from "../../services/visualisation.service";
import {Graph} from "../model/graph";

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {
  count1 = 0;
  count2 = 0;

  constructor(private visualisationService: VisualisationService) { }

  ngOnInit(): void {
    this.visualisationService.getGraph()
      .pipe(
        tap((g: Graph) => {
          g.nodes.forEach((item, key) => {
            console.log('id ' + item.id)
            console.log('blockChainLength ' + item.blockChainLength)
            console.log('mined ' + item.mined)
            console.log('=======================')
          })
        })
      )
      .subscribe();
  }

}
