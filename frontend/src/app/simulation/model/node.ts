import {Block} from "./block";
import {NodeType} from "../nodeType";

import {getPriceByEnumName} from "./country";
import {Protocol} from "src/app/utils/constants";

export class Node {
  public blockChainLength: number = 1;
  public mined: number = 0;
  public neighbours: number[] = [];

  private alive: boolean = true;
  public computingPower: number = 0;

  private lastBlock?: Block;
  private lastMined?: Block;


  // for full nodes
  public blockChain?: Block = new Block(-1, -1);
  public blockChainMap: Map<number, Block> = new Map();
  public blockChainSize: number = 0;

  constructor(public readonly id: number,
              public readonly nodeType: NodeType,
              public country: string,
              public money: number) {

    if (this.nodeType == NodeType.Full) {
      this.blockChainMap = new Map();
      this.blockChain = new Block(-1, -1);
      this.blockChainMap.set(-1, this.blockChain);
    }
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
    if (this.money < paymentAmount) {
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

  public getLast(protocol: Protocol): Block | undefined {

    if (this.nodeType == NodeType.Full) {
      // global variable for protocol
      let lastBlock = this.findLastBlock(protocol);

      if (lastBlock) {
        lastBlock.fullNodeLastBlock = true;
        return lastBlock;
      }
    } else if (this.nodeType == NodeType.Miner) {

      return this.lastMined;

    } else return this.lastBlock;

  }

  public getParent(): Block | undefined {
    return this.lastBlock;
  }

  public mineBlock(block: Block | undefined): void {
    this.lastMined = block;
  }

  // for miner nodes - switches parent block
  // for full nodes - adds the block to the blockchain
  public addBlock(block1: Block | undefined): void {
    if (!block1) return;
    const block = new Block(block1.id, block1.minedBy, block1.parent, [], block1.weight, block1.fullNodeLastBlock);
    if (this.nodeType == NodeType.Full && this.blockChain) {
      if (!this.blockChainMap.has(block.id)) {
        if (block.parent) {
          if (this.blockChainMap.has(block.parent.id)) {
            this.blockChainMap.get(block.parent.id)?.children?.push(block);
          } else {

            this.blockChain.children?.push(block);
          }
        } else {
          // block without parent is treated as a root child
          this.blockChain.children?.push(block);
        }
        this.blockChainMap.set(block.id, block);
        this.blockChainSize++;
      }
    } else {
      if (this.nodeType == NodeType.Miner) {
        if (block.fullNodeLastBlock || !this.lastBlock) {
          this.lastBlock = block;
        }
      } else {
        this.lastBlock = block;
      }
    }

  }

  // find the "tail" of the blockchain
  public findLastBlock(protocol: Protocol) {
    if (this.nodeType == NodeType.Full && this.blockChain) {
      if (protocol == Protocol.LongestChain) {
        let lastBlock = this.longestPath(this.blockChain)[0];
        if (lastBlock == undefined)
          return;
        return this.blockChainMap.get(lastBlock);
      } else if (protocol == Protocol.GHOST) {
        this.updateWeights();
        this._maxWeight = -Infinity;
        this._maxWeightLeaf = -1;
        this.findGHOSTLeaf(this.blockChain);
        return this.blockChainMap.get(this._maxWeightLeaf);
      }
    }
  }

  private longestPath(root: Block): number[] {
    if (!root) return [];
    let paths: any[] = [];
    for (let child of root.children) {
      paths.push(this.longestPath(child));
    }
    let el: number[] = [];
    let maxLen = 0;
    for (let path of paths) {
      if (path.length > maxLen) {
        maxLen = path?.length;
        el = path;
      }
    }
    el.push(root.id);
    return el;
  }

  _maxWeight: number = 0;
  _maxWeightLeaf: number = -1;

  private findGHOSTLeaf(root: Block): void {
    if (!root) return;

    // if leaf
    if (root.children.length == 0) {
      if (root.weight > this._maxWeight) {
        this._maxWeight = root.weight;
        this._maxWeightLeaf = root.id;
      }
    } else {
      for (let child of root.children) {
        this.findGHOSTLeaf(child);
      }
    }
  }

  // update blocks weights for GHOST
  public updateWeights(): void {
    let visited = new Set();
    let queue: number[] = new Array<number>();
    let root = this.blockChainMap.get(-1);
    if (!root) return;
    root.weight = 0;
    visited.add(-1);
    queue.push(-1);

    while (queue.length > 0) {
      const v = queue.shift();
      if (!v) break;
      let b = this.blockChainMap.get(v);
      if (!b) break;
      b.weight = 1 + (b.parent ? b.parent.weight + b.children?.length : b.children?.length);
      for (let child of b.children) {
        if (!visited.has(child.id)) {
          visited.add(child.id);
          queue.push(child.id)
        }
      }
    }
  }

}
