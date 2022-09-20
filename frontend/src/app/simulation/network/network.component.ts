import { Component, OnInit } from '@angular/core';
import {BehaviorSubject, buffer, bufferCount, filter, forkJoin, single, tap, zip} from "rxjs";

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {
  sub1 = new BehaviorSubject<number>(0);
  sub2 = new BehaviorSubject<number>(0);
  count1 = 0;
  count2 = 0;

  constructor() { }

  ngOnInit(): void {
    // zip([this.sub1.asObservable().pipe(tap((a) => console.log('step ' + a))),
    //   this.sub2.asObservable().pipe(tap((a) => console.log('event ' + a)))]).pipe(
    //     tap(([a, b]) => console.log('zipped: ' + a + '   ' + b))
    // ).subscribe();

  }

  press1() {
    this.count1++;
    this.sub1.next(this.count1);
  }

  press2() {
    this.count2++;
    this.sub2.next(this.count2);
  }


}
