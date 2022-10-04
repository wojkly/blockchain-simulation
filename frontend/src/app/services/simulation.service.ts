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
import {randomIntFromInterval} from "../utils/numbers";

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
                if(this.graph.nodes.get(neighbour)?.neighbours.length === 0) {
                  let randomKey = this.getRandomNodeKey();
                  console.log(`Random key generated ${randomKey}`);
                  while(randomKey === neighbour || !this.graph.nodes.get(randomKey)?.isAlive()) {
                    randomKey = this.getRandomNodeKey();
                  }
                  this.graph.nodes.get(neighbour)?.neighbours.push(randomKey);
                }
                //console.log(this.graph.nodes.get(neighbour)?.neighbours !== arr)
                // miner.detachMiner(neighbour);
              })
              this.graph.nodes.delete(miner.id);
            }
          })
        })
      ).subscribe();
  }

  private handleInitialization(): void {
    this.graph = Graph.generateGraph(this.parametersService.getFullNodes(), this.parametersService.getMinerNodes(), this.parametersService.getLightNodes(), this.parametersService.getListeningNodes());
  }

  private handleBlockMined(eventData: SimulationEventData): void {
    let allMiners = Array.from(this.graph.nodes.keys());

    let randArrayIndex = randomIntFromInterval(0, allMiners.length - 1);
    let minerId = allMiners[randArrayIndex];
    let minerNode = this.graph.nodes.get(minerId);

    if (minerNode === undefined) return;

    minerNode.mined++;
    minerNode.blockChainLength++;
    minerNode.receiveReward(this.parametersService.getReward());

    minerNode.neighbours.forEach((neighbour) => {
      let responseEventData = new SimulationEventData();
      responseEventData.senderId = minerId;
      responseEventData.receiverId = neighbour;
      //console.log('CCCCCCCCCCCCCCCCCCCCCCCCCCCCC: ' + responseEventData.senderId + '  ' + responseEventData.receiverId)
      this.eventService.emitSimulationEvent(new SimulationEvent(SimulationEventType.BLOCK_RECEIVED, responseEventData));
    })
  }

  private handleBlockReceived(eventData: SimulationEventData): void {
    //console.log('DDDDDDDDDDDDDDDDDDDDDDDDD1 ' + JSON.stringify(eventData))
    let senderNode = this.graph?.nodes.get(eventData.senderId)
    let receiverNode = this.graph?.nodes.get(eventData.receiverId)
    //console.log('DDDDDDDDDDDDDDDDDDDDDDDDD ' + senderNode + '    ' + receiverNode)
    if (!senderNode) return;
    if (!receiverNode) return;
    //console.log('EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE')

    if (receiverNode.blockChainLength < senderNode.blockChainLength) {
      receiverNode.blockChainLength = senderNode.blockChainLength;

      receiverNode.neighbours.forEach((neighbour) => {
        if(neighbour === eventData.senderId) return;
        //console.log('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF')

        let responseEventData = new SimulationEventData();
        responseEventData.senderId = eventData.receiverId;
        responseEventData.receiverId = neighbour;
        this.eventService.emitSimulationEvent(new SimulationEvent(SimulationEventType.BLOCK_RECEIVED, responseEventData));
      })
    }
  }

  private getRandomNodeKey() {
    let keys = Array.from(this.graph.nodes.keys());
    return keys[Math.floor(Math.random() * keys.length)];
  }


}
