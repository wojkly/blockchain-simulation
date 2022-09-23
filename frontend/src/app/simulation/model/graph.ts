import {MinerNode} from "./miner-node";
import {randomIntFromInterval} from "../../utils/numbers";

type Edge = {
  x: number,
  y: number
}

export class Graph {
  constructor(public nodes: Map<number, MinerNode>) {
  }

  public static generateGraph(minerNodes: number, additionalConnectionsRatio: number = 1 / 2, maxTime: number = 10): Graph {
    let nodes = new Map<number, MinerNode>;
    let id: number = 1;

    // create first miner
    let miner = new MinerNode(id, []);
    nodes.set(id, miner);

    for (let i = 0; i < minerNodes - 1; i++) {
      // create new miner
      let newId = id + 1;
      let newMiner = new MinerNode(newId, []);

      // connect two miners
      newMiner.addNeighbour(id);
      miner.addNeighbour(newId);

      // next iteration, connect all of them with each other
      nodes.set(newId, newMiner)
      miner = newMiner;
      id = newId;
    }

    // connect first miner to the last one to create a cycle
    nodes.get(1)?.addNeighbour(id);
    nodes.get(id)?.addNeighbour(1);

    // ok we've got a cycle, now let's create additional random connections
    // to make it look "random"

    let i: number = 0;

    // adding time constraints 
    let flag = true;
    const start = new Date().getTime();

    while (i < additionalConnectionsRatio * minerNodes && flag) {
      // choose one miner
      let randId = randomIntFromInterval(1, minerNodes);

      // look for a newMiner that isn't his neighbour
      let randNeighbourId = randomIntFromInterval(1, minerNodes);

      while (randNeighbourId == randId || nodes.get(randId)?.isConnected(randNeighbourId)) {
        randNeighbourId = randomIntFromInterval(1, minerNodes);

        // trying to avoid infinite loop
        let elapsedTime = (new Date().getTime() - start) / 1000;
        if (elapsedTime >= maxTime) {
          flag = false;
          break;
        }
      }

      // connect them
      nodes.get(randId)?.addNeighbour(randNeighbourId);
      nodes.get(randNeighbourId)?.addNeighbour(randId);      

      i += 1;
    }

    return new Graph(nodes);
  }
}
