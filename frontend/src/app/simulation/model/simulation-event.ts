import {SimulationEventType} from "./simulation-event-type";
import {SimulationEventData} from "./simulation-event-data";

export class SimulationEvent {
  constructor(
    public readonly eventType: SimulationEventType,
    public readonly eventData: SimulationEventData
  ) {
  }
}
