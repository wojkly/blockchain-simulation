import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MinersDeletingService {

  private minersToDelete = new BehaviorSubject<string[]>(new Array(""));

  constructor() { }

  public getMinersToDelete(): Observable<string[]> {
    return this.minersToDelete.asObservable();
  }

  public emitMinersToDelete(minersToDelete: string[]) {
    this.minersToDelete.next(minersToDelete);
  }
}
