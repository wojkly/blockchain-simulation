import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ParametersService {
  fullNodes: number = 1;
  lightNodes: number = 1;
  minerNodes: number = 1;
  listeningNodes: number = 1;
  price: number = 1;
  reward: number = 5;

  addNewMiner$ = new BehaviorSubject<number>(1);

  constructor() { }

  public getFullNodes(): number {
    return this.fullNodes;
  }

  public setFullNodes(value: number): void {
    this.fullNodes = value;
  }

  public getLightNodes(): number {
    return this.lightNodes;
  }

  public setLightNodes(value: number): void {
    this.lightNodes = value;
  }

  public getMinerNodes(): number {
    return this.minerNodes;
  }

  public setMinerNodes(value: number): void {
    this.minerNodes = value;
  }

  public getListeningNodes(): number {
    return this.listeningNodes;
  }

  public setListeningNodes(value: number): void {
    this.listeningNodes = value;
  }

  public getAllNodes(): number{
    return this.fullNodes + this.lightNodes + this.minerNodes + this.listeningNodes;
  }

  public setElectricityPrice(value: any): void {
    this.price = value;
  }

  public getElectricityPrice(): number {
    return this.price;
  }

  public emitAddNewMinerFrequency(value: any): void {
    this.addNewMiner$.next(value);
  }

  public getAddNewMinerFrequency(): Observable<number> {
    return this.addNewMiner$.asObservable();
  }

  public setReward(value: any): void {
    this.reward = value;
  }

  public getReward(): number {
    return this.reward;
  }

}
