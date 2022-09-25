import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {SimulationEvent} from "../simulation/model/simulation-event";
import {SimulationEventType} from "../simulation/model/simulation-event-type";
import {SimulationEventData} from "../simulation/model/simulation-event-data";

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private event = new BehaviorSubject<SimulationEvent>(new SimulationEvent(SimulationEventType.INITIALIZATION, new SimulationEventData()));

  constructor() { }

  public getSimulationEvent(): Observable<SimulationEvent> {
    return this.event.asObservable();
  }

  public emitSimulationEvent(simulationEvent: SimulationEvent) {
    // console.log('event.next')
    this.event.next(simulationEvent);
  }


  public emitBlockMined() {
    let data = new SimulationEventData();
    let  event = new SimulationEvent(SimulationEventType.BLOCK_MINED, data);
    this.emitSimulationEvent(event);
  }
}
