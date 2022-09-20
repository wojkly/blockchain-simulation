import {Injectable} from '@angular/core';
import {Graph} from "../simulation/model/graph";
import {ParametersService} from "./parameters.service";
import {ButtonsService} from "./buttons.service";
import {VisualisationService} from "./visualisation.service";
import {tap, zip} from "rxjs";
import {StepService} from "./step.service";
import {EventService} from "./event.service";
import {SimulationEvent} from "../simulation/model/simulation-event";
import {SimulationEventType} from "../simulation/model/simulation-event-type";

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  private graph: Graph | undefined;

  constructor(private parametersService: ParametersService,
              private buttonsService: ButtonsService,
              private visualisationService: VisualisationService,
              private stepService: StepService,
              private eventService: EventService,
  ) { }

  public initializeNetwork(): void {
    // this.graph = Graph.generateGraph(this.parametersService.getMinerNodes());
  }

  public initializeSimulation() {
    zip([
      this.stepService.getStep(),
      this.eventService.getSimulationEvent()])
    .pipe(
      tap(() => console.log('zipped')),
      tap(([a, b]) => {
        if (b instanceof SimulationEvent){
          if (b.event === SimulationEventType.BLOCK_MINED) {
            console.log('block mined at node ' + b.nodeId);
            this.eventService.emitSimulationEvent(new SimulationEvent(SimulationEventType.BLOCK_RECEIVED, 2));
            this.eventService.emitSimulationEvent(new SimulationEvent(SimulationEventType.BLOCK_RECEIVED, 3));
            this.eventService.emitSimulationEvent(new SimulationEvent(SimulationEventType.BLOCK_RECEIVED, 4));
          } else if (b.event === SimulationEventType.BLOCK_RECEIVED) {
            console.log('block received at node ' + b.nodeId);
          }else {
            console.log('init');
          }
      }}
        )
    ).subscribe();
  }


}
