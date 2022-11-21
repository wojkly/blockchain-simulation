import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EdgeService {
  private TIME_TO_LIVE = 7;

  private $activeEdges = new BehaviorSubject([{edge: '', ttl: 0}]);

  private activeEdges: {edge: string, ttl: number}[] = [];

  constructor() { }

  public addEdge(source: number, target: number): void {
    this.activeEdges.push({edge: `${source}_${target}`,ttl: this.TIME_TO_LIVE});
    this.emitEdges();
  }

  public emitEdges() {
    this.$activeEdges.next(this.activeEdges);
  }

  public depleteTTL(): void {
    this.activeEdges = this.activeEdges.filter(el => el.ttl >= 1);
    this.activeEdges.forEach(el => {
      el.ttl -= 1;
    });
  }

  public getEdges() {
    return this.$activeEdges.asObservable();
  }


}
