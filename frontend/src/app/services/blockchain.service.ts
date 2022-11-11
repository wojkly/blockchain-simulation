import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {

  private $idEmitter: BehaviorSubject<number> = new BehaviorSubject<number>(1);

  constructor() { }

  public get() {
    return this.$idEmitter.asObservable();
  }

  public emit() {
    this.$idEmitter.next(this.$idEmitter.value + 1);
  }
}
