export class MinerNode {
  public blockChainLength: number = 1;
  public mined: number = 0;

  private money: number = 50;
  private isAlive: boolean = true;


  constructor(public readonly id: number,
              public neighbours: number[] = []) {
  }

  public addNeighbour(minerId: number): void {
    if (!this.isConnected(minerId)) this.neighbours.push(minerId);
  }

  public detachMiner(minerId: number): void {
    this.neighbours.filter(el => {
      return el !== minerId;
    })
  }

  public isConnected(minerId: number): boolean {
    return this.neighbours.includes(minerId);
  }

  public settlePayment(paymentAmount: number): boolean {
    if (this.money < 1) {
      // kill the miner
      console.log(`kill miner ${this.id}`);
      this.isAlive = false;
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
