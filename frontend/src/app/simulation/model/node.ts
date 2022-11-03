import {Block} from "./block";
import {NodeType} from "../nodeType";
import {getPriceByEnumName} from "./country";

export class Node {
  public blockChainLength: number = 1;
  public mined: number = 0;
  public neighbours: number[] = [];

  private alive: boolean = true;
  public computingPower: number = 0;

  private blockChain?: Block;

  constructor(public readonly id: number,
              public readonly nodeType: NodeType,
              public readonly country: string,
              public money: number) {
  }

  public connect(nodeId: number): void {
    if (!this.isConnected(nodeId)) this.neighbours.push(nodeId);
  }

  public detachMiner(minerId: number): void {
    this.neighbours = this.neighbours.filter(el => {
      return el !== minerId;
    })
  }

  public isConnected(minerId: number): boolean {
    return this.neighbours.includes(minerId);
  }

  public settlePayment(paymentAmount: number): boolean {
    paymentAmount *= getPriceByEnumName(this.country)
    if (this.nodeType != NodeType.Miner) {
      return true;
    }
    if (this.money <= 0) {
      // kill the miner
      this.alive = false;
      return false;
    }
    this.money -= paymentAmount;
    return true;
  }

  public receiveReward(reward: number): void {
    this.money += reward;
  }

  public isAlive() {
    return this.alive;
  }

  public getFirst() {
    return this.blockChain;
  }

  public getLast(): Block | undefined {
    if(this.blockChain) {
      let temp = this.blockChain;
      while(temp?.next !== null) {
        temp = temp?.next;
      }
      return temp;
    }
    return undefined;
  }

  public attachBlock(id: number, minedBy: number): void {
    if(this.blockChain) {
      let temp = this.blockChain;
      while(temp?.next !== null) {
        temp = temp?.next;
      }
      temp.next = new Block(id, minedBy);
      temp.next.previous = temp;
      return;
    }
    this.blockChain = new Block(id, minedBy);
  }
}
