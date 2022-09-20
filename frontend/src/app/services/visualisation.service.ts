import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Graph} from "../simulation/model/graph";

@Injectable({
  providedIn: 'root'
})
export class VisualisationService {
  // private graph = new BehaviorSubject<Graph>(new Graph([]));

  constructor() { }

  // public getGraph(): Observable<Graph> {
  //   return this.graph.asObservable();
  // }
  //
  // public emitGraph(graph: Graph) {
  //   this.graph.next(graph);
  // }
}
