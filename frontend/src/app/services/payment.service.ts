import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly DEFAULT_ELECTRICAL_BILL = 1;

  private paymentAmount = this.DEFAULT_ELECTRICAL_BILL;

  private payment$ = new BehaviorSubject<number>(this.paymentAmount);

  constructor() { }

  public getPayment() {
    return this.payment$.asObservable();
  }

  public emitPayment() {
    this.payment$.next(this.paymentAmount);
  }

  public changePaymentAmount(newPaymentAmount: number) {
    this.paymentAmount = newPaymentAmount;
  }
}
