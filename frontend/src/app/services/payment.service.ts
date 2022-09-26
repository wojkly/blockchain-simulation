import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ParametersService} from "./parameters.service";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private payment$ = new BehaviorSubject<number>(this.parametersService.getElectricityPrice());

  constructor(private parametersService: ParametersService) {
  }

  public getPayment() {
    return this.payment$.asObservable();
  }

  public emitPayment() {
    console.log("GOWNO" + this.parametersService.getElectricityPrice())
    this.payment$.next(this.parametersService.getElectricityPrice());
  }
}
