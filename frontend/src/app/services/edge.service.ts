import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EdgeService {
  private $activeEdges = new BehaviorSubject(['']);

  private activeEdges: string[] = [];

  constructor() { }

  public addEdge(source: number, target: number): void {
    this.activeEdges.push(`${source}_${target}`);
  }

  public emitEdges() {
    this.$activeEdges.next(this.activeEdges);
  }

  public clearEdges(): void {
    this.activeEdges = [];
  }

  public getEdges() {
    return this.$activeEdges.asObservable();
  }


}
