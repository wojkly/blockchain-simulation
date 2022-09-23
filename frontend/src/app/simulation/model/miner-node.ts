export class MinerNode {
  public blockChainLength = 1;
  public mined = 0;

  constructor(public readonly id: number,
              public neighbours: number[] = []) {
  }

  public addNeighbour(minerId: number): void {
    if (!this.isConnected(minerId)) this.neighbours.push(minerId);
  }

  public isConnected(minerId: number): boolean {
    return this.neighbours.includes(minerId);
  }

}
