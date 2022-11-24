import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ParametersService {
  fullNodes: number = 5;
  lightNodes: number = 5;
  minerNodes: number = 5;
  listeningNodes: number = 5;
  initialMinersData = [];
  price: number = 1;
  reward: number = 5;
  frequency: number = 1;

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


  public getInitialMinersData(): any[] {
    return this.initialMinersData;
  }

  public setInitialMinersData(value: []): void {
    this.initialMinersData = value;
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

  public setFrequency(value: any): void {
    this.frequency = value;
  }

  public getFrequency(): number {
    return this.frequency;
  }

}
