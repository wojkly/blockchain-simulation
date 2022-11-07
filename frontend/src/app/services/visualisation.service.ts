import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Graph} from "../simulation/model/graph";
import {Node} from "../simulation/model/node";
import {EdgeService} from "./edge.service";

@Injectable({
  providedIn: 'root'
})
export class VisualisationService {
  private graph = new BehaviorSubject<{graph: Graph, activeEdges: {edge: string, ttl: number}[]}>({
    graph: new Graph(new Map<number, Node>()),
    activeEdges: [{edge: '', ttl: 0}]
  });

  private activeEdges: {edge: string, ttl: number}[] = [];

  constructor(
    private edgeService: EdgeService
  ) {
    this.edgeService.getEdges().subscribe(res => {
      this.activeEdges = res;
      //this.emitGraph(this.graph.getValue().graph);
    })
  }

  public getGraph(): Observable<{graph: Graph, activeEdges: {edge: string, ttl: number}[]}> {
    return this.graph.asObservable();
  }

  public emitGraph(graph: Graph) {
    this.graph.next({
      graph: graph,
      activeEdges: this.activeEdges
    });
  }
}
