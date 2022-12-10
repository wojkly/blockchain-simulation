import {Injectable} from '@angular/core';
import {Protocol} from "../utils/constants";

@Injectable({
  providedIn: 'root'
})
export class ProtocolService {

  public protocol: Protocol;

  constructor() {
    this.protocol = Protocol.LongestChain;
  }

  changeProtocol(isLongestChain: boolean): void {
    console.log(isLongestChain)
    if(isLongestChain) {
      this.protocol = Protocol.LongestChain;
      return;
    }
    this.protocol = Protocol.GHOST;
  }
}
