import {Block} from "./block";
import {NodeType} from "../nodeType";

export class MinerNode {
  public blockChainLength: number = 1;
  public mined: number = 0;
  public nodeType: NodeType = NodeType.Miner;

  public money: number = 10;
  private alive: boolean = true;

  private blockChain?: Block;

  constructor(public readonly id: number,
              public neighbours: number[] = []) {
  }

  public addNeighbour(minerId: number): void {
    if (!this.isConnected(minerId)) this.neighbours.push(minerId);
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
    if (this.money < 1) {
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

  public setNodeType(nodeType: NodeType){
    this.nodeType = nodeType;
  }

}
