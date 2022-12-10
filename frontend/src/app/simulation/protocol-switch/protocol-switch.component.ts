import {Component, OnInit} from '@angular/core';
import {ProtocolService} from "../../services/protocol.service";
import {Protocol} from "../../utils/constants";

@Component({
  selector: 'app-protocol-switch',
  templateUrl: './protocol-switch.component.html',
  styleUrls: ['./protocol-switch.component.scss']
})
export class ProtocolSwitchComponent implements OnInit {
  protocol: Protocol = Protocol.LongestChain;

  constructor(
    private protocolService: ProtocolService,
  ) { }

  ngOnInit(): void {
  }

  changeProtocol(): void {
    if (this.protocol === Protocol.LongestChain)
      this.protocol = Protocol.GHOST;
    else
      this.protocol = Protocol.LongestChain;
    this.protocolService.changeProtocol(this.protocol === Protocol.LongestChain);
  }

}
