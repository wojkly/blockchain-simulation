export class MinerNode {
  public blockChainLength = 1;
  public mined = 0;

  private money = 50;

  constructor(public readonly id: number,
              public neighbours: number[] = []) {
  }

  public addNeighbour(minerId: number): void {
    if (!this.isConnected(minerId)) this.neighbours.push(minerId);
  }

  public isConnected(minerId: number): boolean {
    return this.neighbours.includes(minerId);
  }

  public settlePayment(paymentAmount: number): boolean {
    if (this.money < 1) {
      // kill the miner
      console.log(`kill miner ${this.id}`);
      return false;
    }
    this.money -= paymentAmount;
    console.log(`miner ${this.id} now has ${this.money}`);
    return true;
  }

  public receiveReward(reward: number): void {
    this.money += reward;
    console.log(`miner ${this.id} received ${reward}$`);
  }

}
