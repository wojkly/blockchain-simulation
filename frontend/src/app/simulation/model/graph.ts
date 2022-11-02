import {Node} from "./node";
import {randomIntFromInterval} from "../../utils/numbers";
import {NodeType} from "../nodeType";
import {getRandomCountryEnumName} from "./country";

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

  public static generateGraph(fullNodes: number, minerNodes: number, lightNodes: number, listeningNodes: number, minersData: any[], immortalNodesConnectionRatio: number = 1 / 2): Graph {
    let nodesMap = new Map<number, Node>;
    let id: number = 0;
    const immortalNodes = fullNodes + lightNodes + listeningNodes;
    const maxPossibleEdgesBetweenImmortalNodes = immortalNodes * (immortalNodes - 1) / 2;
    let totalEdges = 0;
    let neighbour = -1;

    // create first node (full)
    let node = new Node(id, NodeType.Full, getRandomCountryEnumName(), 0);
    nodesMap.set(id, node);

    id += 1;

    //create other full nodes
    for (let i = 1; i < fullNodes; i++) {
      let node = new Node(id, NodeType.Full, getRandomCountryEnumName(), 0);
      neighbour = Graph.genrateRandomNumber(id - 1);
      let neighbourNode = nodesMap.get(neighbour);

      node.connect(neighbour);
      neighbourNode?.connect(id);
      totalEdges += 1;

      nodesMap.set(id, node);
      id += 1;
    }

    //create listening nodes
    for (let i = 0; i < listeningNodes; i++) {
      let node = new Node(id, NodeType.Listening, getRandomCountryEnumName(), 0);
      neighbour = Graph.genrateRandomNumber(id - 1);
      let neighbourNode = nodesMap.get(neighbour);

      node.connect(neighbour);
      neighbourNode?.connect(id);
      totalEdges += 1;

      nodesMap.set(id, node);
      id += 1;
    }

    //create light nodes
    for (let i = 0; i < lightNodes; i++) {
      let node = new Node(id, NodeType.Spv, getRandomCountryEnumName(), 0);
      neighbour = Graph.genrateRandomNumber(id - 1);
      let neighbourNode = nodesMap.get(neighbour);

      node.connect(neighbour);
      neighbourNode?.connect(id);
      totalEdges += 1;

      nodesMap.set(id, node);
      id += 1;
    }

    //add some more edges
    const maxImmortalNodeId = id - 1;
    let addedEdges = 0;
    let edgesToAdd = (maxPossibleEdgesBetweenImmortalNodes * immortalNodesConnectionRatio) - totalEdges;

    while (addedEdges < edgesToAdd) {
      let u = Graph.genrateRandomNumber(maxImmortalNodeId);
      let v = Graph.genrateRandomNumber(maxImmortalNodeId);
      if (u == v) {
        continue;
      }
      if (nodesMap.get(u)?.isConnected(v)) {
        continue;
      }

      nodesMap.get(u)?.connect(v);
      nodesMap.get(v)?.connect(u);

      addedEdges += 1;
    }


    //create miner nodes
    for (let i = 0; i < minerNodes; i++) {
      console.log(minersData[i])
      neighbour = Graph.genrateRandomNumber(maxImmortalNodeId);
      let node = new Node(id, NodeType.Miner, minersData[i].country, minersData[i].money);
      node.computingPower = minersData[i].power;
      let neighbourNode = nodesMap.get(neighbour);

      node.connect(neighbour);
      neighbourNode?.connect(id);

      nodesMap.set(id, node);
      id += 1;
    }

    //todo optional add more connections between miners and immortal ndoes
    return new Graph(nodesMap);
  }

  private static genrateRandomNumber(max: number) {
    return Math.floor(Math.random() * (max + 1));
  }
}
