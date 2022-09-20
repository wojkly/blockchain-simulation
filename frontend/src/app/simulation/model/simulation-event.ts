import {SimulationEventType} from "./simulation-event-type";

export class SimulationEvent {
  constructor(
    public readonly event: SimulationEventType,
    public readonly nodeId?: number
  ) {
  }
}
