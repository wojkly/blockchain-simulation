export class MinerNode {
  public blockChainLength: number = 1;
  public mined: number = 0;

  public money: number = 10;
  private alive: boolean = true;


  constructor(public readonly id: number,
              public neighbours: number[] = []) {
  }

  public addNeighbour(minerId: number): void {
    if (!this.isConnected(minerId)) this.neighbours.push(minerId);
  }

  public detachMiner(minerId: number): void {
    this.neighbours = this.neighbours.filter(el => {
      return el !== minerId;
    })
  }

  public isConnected(minerId: number): boolean {
    return this.neighbours.includes(minerId);
  }

  public settlePayment(paymentAmount: number): boolean {
    console.log("PAYMENT " + paymentAmount)
    console.log("MONEY " + this.money)
    console.log(this.money - paymentAmount)
    if (this.money < 1) {
      // kill the miner
      //console.log(`kill miner ${this.id}`);
      this.alive = false;
      return false;
    }
    this.money -= paymentAmount;
    //console.log(`miner ${this.id} now has ${this.money}`);
    return true;
  }

  public receiveReward(reward: number): void {
    this.money += reward;
    //console.log(`miner ${this.id} received ${reward}$`);
  }

  public isAlive() {
    return this.alive;
  }

}
