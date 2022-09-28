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
import {MinerNode} from "../simulation/model/miner-node";
import {SimulationEventData} from "../simulation/model/simulation-event-data";
import {PaymentService} from "./payment.service";
import {MinersService} from "./miners.service";

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  private graph = new Graph(new Map<number, MinerNode>());

  private readonly DEFAULT_REWARD_AMOUNT: number = 10;

  constructor(private parametersService: ParametersService,
              private buttonsService: ButtonsService,
              private visualisationService: VisualisationService,
              private stepService: StepService,
              private eventService: EventService,
              private paymentService: PaymentService,
              private minersService: MinersService,
  ) { }


  public initializeSimulation() {
    zip([
      this.stepService.getStep(),
      this.eventService.getSimulationEvent()])
    .pipe(
      //tap(() => console.log('zipped')),
      tap(([a, b]) => {
        if (b instanceof SimulationEvent){
          //console.log('handling event ' + b.eventType);
          switch (b.eventType) {
            case SimulationEventType.INITIALIZATION:
              this.handleInitialization();
              break;
            case SimulationEventType.BLOCK_MINED:
              this.handleBlockMined(b.eventData);
              break;
            case SimulationEventType.BLOCK_RECEIVED:
              this.handleBlockReceived(b.eventData);
              break;
          }

          //console.log('emiting graph');
          this.visualisationService.emitGraph(this.graph);
          this.minersService.emit();
        }
        this.stepService.unblockSemaphore();
      })
    ).subscribe();

    this.paymentService.getPayment()
      .pipe(
        tap(paymentAmount => {
          this.graph.nodes.forEach(miner => {
            if (!miner.settlePayment(paymentAmount)) {
              miner.neighbours.forEach(neighbour => {
                this.graph.nodes.get(neighbour)?.detachMiner(miner.id);
              })
              this.graph.nodes.delete(miner.id);
              this.minersService.emit();
            }
          })
        })
      ).subscribe();
  }

  private handleInitialization(): void {
    let node1 = new MinerNode(1, [2, 5, 6]);
    let node2 = new MinerNode(2, [1, 3, 5, 4]);
    let node3 = new MinerNode(3, [2, 4]);
    let node4 = new MinerNode(4, [2, 3, 5]);
    let node5 = new MinerNode(5, [1, 2, 4]);
    let node6 = new MinerNode(6, [1, 5]);

    let nodes = new Map<number, MinerNode>;
    nodes.set(1, node1);
    nodes.set(2, node2);
    nodes.set(3, node3);
    nodes.set(4, node4);
    nodes.set(5, node5);
    nodes.set(6, node6);

    // this.graph = new Graph(nodes);

    //todo
    this.graph = Graph.generateGraph(this.parametersService.getMinerNodes());
  }

  private handleBlockMined(eventData: SimulationEventData): void {
    let minerNode = this.graph?.nodes.get(eventData.minerId)
    if (!minerNode) return;

    minerNode.mined++;
    minerNode.blockChainLength++;
    minerNode.receiveReward(this.DEFAULT_REWARD_AMOUNT);

    minerNode.neighbours.forEach((neighbour) => {
      let responseEventData = new SimulationEventData();
      responseEventData.senderId = eventData.minerId;
      responseEventData.receiverId = neighbour;
      this.eventService.emitSimulationEvent(new SimulationEvent(SimulationEventType.BLOCK_RECEIVED, responseEventData));
    })
  }

  private handleBlockReceived(eventData: SimulationEventData): void {
    let senderNode = this.graph?.nodes.get(eventData.senderId)
    let receiverNode = this.graph?.nodes.get(eventData.receiverId)
    if (!senderNode) return;
    if (!receiverNode) return;

    if (receiverNode.blockChainLength < senderNode.blockChainLength) {
      receiverNode.blockChainLength = senderNode.blockChainLength;

      receiverNode.neighbours.forEach((neighbour) => {
        if(neighbour === eventData.senderId) return;

        let responseEventData = new SimulationEventData();
        responseEventData.senderId = eventData.receiverId;
        responseEventData.receiverId = neighbour;
        this.eventService.emitSimulationEvent(new SimulationEvent(SimulationEventType.BLOCK_RECEIVED, responseEventData));
      })
    }
  }

  public getMiners(): IterableIterator<MinerNode> {
    return this.graph.nodes.values();
  }


}
