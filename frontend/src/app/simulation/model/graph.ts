import {MinerNode} from "./miner-node";

type Edge = {
  x: number,
  y: number
}

export class Graph {
  // minerNodes: MinerNode[];
  // edgesSet: Set<Edge>

  // constructor(private nodes: MinerNode[], private edges: Set<Edge>) {
  //   this.minerNodes = nodes;
  //   this.edgesSet = edges;
  // }

  // public static generateGraph(minerNodes: number): Graph {
  //   let nodes = [];
  //   let usedIds = new Set<number>();
  //   let edges = new Set<Edge>();
  //
  //   // create first miner
  //   let id = Math.random() * 10001;
  //   usedIds.add(id);
  //   let currMiner = new MinerNode(id, []);
  //   nodes.push(currMiner);
  //
  //   // in a loop, create new miners and connect them to their neighbour (previously created miner)
  //   for(let i = 0; i < minerNodes; i++) {
  //     while(!usedIds.has(id)) id = Math.random() * 10001;
  //     let newMiner = new MinerNode(id, []);
  //     newMiner.addNeighbour(currMiner.id);
  //     currMiner.addNeighbour(newMiner.id);
  //     nodes.push(newMiner);
  //     edges.add({x: newMiner.id, y: currMiner.id});
  //     currMiner = newMiner;
  //   }
  //
  //   let firstMiner = nodes[0];
  //   firstMiner.addNeighbour(currMiner.id);
  //   currMiner.addNeighbour(firstMiner.id);
  //   edges.add({x: firstMiner.id, y: currMiner.id});
  //
  //   // create additional edges
  //   let numberOfEdges = minerNodes / 3;
  //   let j = 0;
  //   while(j < numberOfEdges) {
  //     let index1 = Math.random() * nodes.length;
  //     let miner1 = nodes[index1];
  //     let index2 = Math.random() * nodes.length;
  //     let miner2 = nodes[index2];
  //     miner1.addNeighbour(miner2.id);
  //     miner2.addNeighbour(miner1.id);
  //     edges.add({x: miner2.id, y:miner1.id});
  //   }
  //   return new Graph(nodes, edges);
  // }
}
