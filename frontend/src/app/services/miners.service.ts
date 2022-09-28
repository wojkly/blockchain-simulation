import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MinersService {

  private $minerListChange = new BehaviorSubject<string>('');

  constructor() { }

  public get() {
    return this.$minerListChange.asObservable();
  }

  public emit() {
    this.$minerListChange.next('');
  }
}
