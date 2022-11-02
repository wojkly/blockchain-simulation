import {Injectable} from '@angular/core';
import {Graph} from "../simulation/model/graph";
import {ParametersService} from "./parameters.service";
import {ButtonsService} from "./buttons.service";
import {VisualisationService} from "./visualisation.service";
import {interval, Subscription, tap, zip} from "rxjs";
import {StepService} from "./step.service";
import {EventService} from "./event.service";
import {SimulationEvent} from "../simulation/model/simulation-event";
import {SimulationEventType} from "../simulation/model/simulation-event-type";
import {Node} from "../simulation/model/node";
import {SimulationEventData} from "../simulation/model/simulation-event-data";
import {PaymentService} from "./payment.service";
import {randomIntFromInterval} from "../utils/numbers";
import {MinerService} from "./miner.service";
import {BlockchainService} from "./blockchain.service";
import {NodeType} from "../simulation/nodeType";
import {AddMinerService} from "./add-miner.service";
import {EdgeService} from "./edge.service";

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  private graph = new Graph(new Map<number, Node>());

  constructor(private parametersService: ParametersService,
              private buttonsService: ButtonsService,
              private visualisationService: VisualisationService,
              private stepService: StepService,
              private eventService: EventService,
              private paymentService: PaymentService,
              private minerService: MinerService,
              private blockchainService: BlockchainService,
              private addMinerService: AddMinerService,
              private edgeService: EdgeService
  ) { }

  nextId: number = 0;

  private addMinerFrequencySubscription: Subscription | undefined;
  private addMinerSubscription: Subscription | undefined;

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

          this.visualisationService.emitGraph(this.graph);
          this.minerService.emit();
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
              this.minerService.emit();
            }
          })
        })
      ).subscribe();

    this.blockchainService.get().subscribe(id => {
      this.nextId = id;
    })

    this.addMinerService.getAddMiner()
      .pipe(
        tap((isAdd: boolean) => {
          if(isAdd) {
            this.startAddingMiners();
          } else {
            this.stopAddingMiners();
          }
        })
      )
      .subscribe();
  }

  private startAddingMiners() {
    this.addMinerFrequencySubscription = this.parametersService.getAddNewMinerFrequency()
      .pipe(
        tap((timeInterval: number) => {
          if (timeInterval > 0) {
            this.addMinerSubscription = interval(ButtonsService.DEFAULT_INTERVAL / timeInterval * 10).pipe(
              tap(() => {
                this.addNewMiner();
                this.visualisationService.emitGraph(this.graph);
              })
            ).subscribe();
          } else {
            this.addMinerSubscription?.unsubscribe();
          }
        })
      )
      .subscribe();
  }
  private stopAddingMiners() {
    this.addMinerFrequencySubscription?.unsubscribe();
    this.addMinerSubscription?.unsubscribe();
  }

  private addNewMiner() {
    let newMinerId = this.getMaxId() + 1;

    const newMiner = new Node(newMinerId, NodeType.Miner);
    newMiner.computingPower = randomIntFromInterval(1, 10);

    const immortalNode = this.getRandomNonMiner();

    newMiner.connect(immortalNode.id);
    immortalNode.connect(newMiner.id);

    this.graph.nodes.set(newMinerId, newMiner);
  }

  private handleInitialization(): void {
    this.graph = Graph.generateGraph(this.parametersService.getFullNodes(), this.parametersService.getMinerNodes(), this.parametersService.getLightNodes(), this.parametersService.getListeningNodes());
  }

  private handleBlockMined(eventData: SimulationEventData): void {
    let allMiners: number[] = [];
    this.graph.nodes.forEach((value: Node, key: number) => {
      if(value.nodeType == NodeType.Miner){
        for (let i = 0; i < value.computingPower; i++){
          allMiners.push(key)
        }
      }
    })

    let randArrayIndex = randomIntFromInterval(0, allMiners.length - 1);
    let minerId = allMiners[randArrayIndex];
    let minerNode = this.graph.nodes.get(minerId);

    if (minerNode === undefined) return;

    minerNode.attachBlock(this.nextId, minerNode.id);
    this.blockchainService.emit();

    minerNode.mined++;
    minerNode.blockChainLength++;
    minerNode.receiveReward(this.parametersService.getReward());

    minerNode.neighbours.forEach((neighbour) => {
      let responseEventData = new SimulationEventData();
      responseEventData.senderId = minerId;
      responseEventData.receiverId = neighbour;
      this.edgeService.addEdge(responseEventData.senderId, responseEventData.receiverId);
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

      const receivedBlock = senderNode.getLast();

      if(receiverNode) {
        receiverNode.attachBlock(receivedBlock!.id, receivedBlock!.minedBy);
      }

      receiverNode.neighbours.forEach((neighbour) => {
        if(neighbour === eventData.senderId) return;

        let responseEventData = new SimulationEventData();
        responseEventData.senderId = eventData.receiverId;
        responseEventData.receiverId = neighbour;
        this.edgeService.addEdge(responseEventData.senderId, responseEventData.receiverId);
        this.eventService.emitSimulationEvent(new SimulationEvent(SimulationEventType.BLOCK_RECEIVED, responseEventData));
      })
    }
  }

  private getRandomNodeKey() {
    let keys = Array.from(this.graph.nodes.keys());
    return keys[Math.floor(Math.random() * keys.length)];
  }

  public getMiners() {
    return Array.from(this.graph.nodes.values()).filter((value, index) => value.nodeType == NodeType.Miner);
  }

  private getRandomNonMiner(): Node {
    const nonMiners = this.getNonMiners();
    return nonMiners[Math.floor(Math.random() * nonMiners.length)];
  }

  private getNonMiners(): Node[] {
    return Array.from(this.graph.nodes.values()).filter((value, index) => value.nodeType != NodeType.Miner);
  }

  private getMaxId(): number {
    return Math.max(...Array.from(this.graph.nodes.keys()));
  }
}
