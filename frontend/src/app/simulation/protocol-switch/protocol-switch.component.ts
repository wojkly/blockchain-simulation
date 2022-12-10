import {Component, OnInit} from '@angular/core';
import {ProtocolService} from "../../services/protocol.service";
import {FormControl} from "@angular/forms";
import {Protocol} from "../../utils/constants";

@Component({
  selector: 'app-protocol-switch',
  templateUrl: './protocol-switch.component.html',
  styleUrls: ['./protocol-switch.component.scss']
})
export class ProtocolSwitchComponent implements OnInit {
  isChecked = true;

  // private protocolFC: FormControl<Protocol> = new FormControl<Protocol>(Protocol.LongestChain);

  constructor(
    private protocolService: ProtocolService,
  ) { }

  ngOnInit(): void {
  }

  getProtocolName(): string {
    if (this.isChecked)
      return 'Longest chain';
    return 'GHOST';
  }

  changeProtocol(): void {
    this.protocolService.changeProtocol(this.isChecked);
  }

}
