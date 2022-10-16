import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Graph} from "../simulation/model/graph";
import {Node} from "../simulation/model/node";

@Injectable({
  providedIn: 'root'
})
export class VisualisationService {
  private graph = new BehaviorSubject<Graph>(new Graph(new Map<number, Node>()));

  constructor() { }

  public getGraph(): Observable<Graph> {
    return this.graph.asObservable();
  }

  public emitGraph(graph: Graph) {
    this.graph.next(graph);
  }
}
