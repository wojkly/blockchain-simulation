import {Node} from "./node";
import {randomIntFromInterval} from "../../utils/numbers";
import {NodeType} from "../nodeType";

type Edge = {
  x: number,
  y: number
}

export class Graph {
  constructor(public nodes: Map<number, Node>) {
  }

  private randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public static generateGraph(fullNodes: number, minerNodes: number, lightNodes: number, listeningNodes: number, additionalConnectionsRatio: number = 1 / 2, maxTime: number = 10): Graph {
    let nodes = new Map<number, Node>;
    let id: number = 1;
    const immortalNodes = fullNodes + lightNodes + listeningNodes;

    // create first miner
    let node = new Node(id, []);
    nodes.set(id, node);

    for (let i = 0; i < immortalNodes - 1; i++) {
      // create new miner
      let newId = id + 1;
      let newNode = new Node(newId, []);

      // connect two miners
      newNode.addNeighbour(id);
      node.addNeighbour(newId);

      // next iteration, connect all of them with each other
      nodes.set(newId, newNode)
      node = newNode;
      id = newId;
    }

    // connect first miner to the last one to create a cycle
    nodes.get(1)?.addNeighbour(id);
    nodes.get(id)?.addNeighbour(1);

    let idxArr = Array.from(Array(immortalNodes).keys())
    idxArr.sort(() => Math.random() - 0.5);

    for (var idx = 0; idx < fullNodes; idx++) {
      nodes.get(idxArr[idx])?.setNodeType(NodeType.Full);
    }
    for (let i = 0; i < lightNodes; i++, idx++) {
      nodes.get(idxArr[idx])?.setNodeType(NodeType.Spv);
    }
    for (let i = 0; i < listeningNodes; i++, idx++) {
      nodes.get(idxArr[idx])?.setNodeType(NodeType.Listening);
    }


    // ok we've got a cycle, now let's create additional random connections
    // to make it look "random"

    let i: number = 0;

    // adding time constraints
    let flag = true;
    const start = new Date().getTime();

    while (i < additionalConnectionsRatio * immortalNodes && flag) {
      // choose one miner
      let randId = randomIntFromInterval(1, immortalNodes);

      // look for a newMiner that isn't his neighbour
      let randNeighbourId = randomIntFromInterval(1, immortalNodes);

      while (randNeighbourId == randId || nodes.get(randId)?.isConnected(randNeighbourId)) {
        randNeighbourId = randomIntFromInterval(1, immortalNodes);

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

    for (let i = 0; i < minerNodes; i++) {
      // create new miner
      const newId = id + 1;
      const newMiner = new Node(newId, []);

      const randIdx = randomIntFromInterval(1, immortalNodes - 1);

      // // connect two miners
      newMiner.addNeighbour(randIdx);
      nodes.get(randIdx)?.addNeighbour(newId)
      //
      // // next iteration, connect all of them with each other
      nodes.set(newId, newMiner)
      // miner = newMiner;
      id = newId;
    }

    //console.log(nodes.values());

    return new Graph(nodes);
  }
}
