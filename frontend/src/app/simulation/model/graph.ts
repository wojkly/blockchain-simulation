import {MinerNode} from "./miner-node";
import {randomIntFromInterval} from "../../utils/numbers";
import {NodeType} from "../nodeType";

type Edge = {
  x: number,
  y: number
}

export class Graph {
  constructor(public nodes: Map<number, MinerNode>) {
  }

  public static generateGraph(fullNodes: number, minerNodes: number, lightNodes: number, listeningNodes: number, additionalConnectionsRatio: number = 1 / 2, maxTime: number = 10): Graph {
    let nodes = new Map<number, MinerNode>;
    let id: number = 1;
    let numberOfNodes = fullNodes + minerNodes + lightNodes + listeningNodes;

    // create first miner
    let miner = new MinerNode(id, []);
    nodes.set(id, miner);

    for (let i = 0; i < numberOfNodes - 1; i++) {
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

    let idxArr = Array.from(Array(numberOfNodes).keys())
    idxArr.sort(() => Math.random() - 0.5);

    for(var idx = 0; idx < minerNodes; idx++) {
      nodes.get(idxArr[idx])?.setNodeType(NodeType.Miner);
    }
    for(let i = 0; i < fullNodes; i++, idx++) {
      nodes.get(idxArr[idx])?.setNodeType(NodeType.Full);
    }
    for(let i = 0; i < lightNodes; i++, idx++) {
      nodes.get(idxArr[idx])?.setNodeType(NodeType.Spv);
    }
    for(let i = 0; i < listeningNodes; i++, idx++) {
      nodes.get(idxArr[idx])?.setNodeType(NodeType.Listening);
    }


    // ok we've got a cycle, now let's create additional random connections
    // to make it look "random"

    let i: number = 0;

    // adding time constraints
    let flag = true;
    const start = new Date().getTime();

    while (i < additionalConnectionsRatio * numberOfNodes && flag) {
      // choose one miner
      let randId = randomIntFromInterval(1, numberOfNodes);

      // look for a newMiner that isn't his neighbour
      let randNeighbourId = randomIntFromInterval(1, numberOfNodes);

      while (randNeighbourId == randId || nodes.get(randId)?.isConnected(randNeighbourId)) {
        randNeighbourId = randomIntFromInterval(1, numberOfNodes);

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
