export class MinerNode {

  public mined = 0;

  constructor(public readonly id: number,
              public readonly neighbours: [number]) {
  }
}
