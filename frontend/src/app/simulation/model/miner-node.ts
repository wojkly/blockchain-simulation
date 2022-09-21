export class MinerNode {
  public blockChainLength = 1;
  public mined = 0;

  constructor(public readonly id: number,
              public neighbours: number[] = []) {
  }

}
