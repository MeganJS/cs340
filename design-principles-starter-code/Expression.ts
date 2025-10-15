// 1. What design principles does this code violate?
// This isn't very good Information Hiding. Score, income, and authorized are all sensitive information.
// Do they really need to be passed into this classless function?
// It also displays poor decomposition in its extremely convoluted if-statement.
// 2. Refactor the code to improve its design.

export class Client {
  private score: number;
  private income: number;
  private authorized: boolean;

  public constructor(score: number, income: number, authorized: boolean) {
    this.score = score;
    this.income = income;
    this.authorized = authorized;
  }

  public isLowRiskClient(): boolean {
    if (this.score > 700) {
      return true;
    }
    if (this.income > 100000) {
      return true;
    }
    if (this.income >= 40000 && this.authorized && this.score > 500) {
      return true;
    }
    return false;
  }
}
