export type Socks = { style: string; color: string };
export type Shirt = { style: string; size: string };
export type Pants = { waist: number; length: number };

export class Drawer<T> {
  private items: Array<T>;

  constructor() {
    this.items = new Array<T>();
  }
  //https://community.lambdatest.com/t/how-do-i-initialize-an-empty-typed-array-in-typescript/31519/2

  public isEmpty(): boolean {
    if (this.items.length == 0) {
      return true;
    }
    return false;
  }

  public addItem(item: T) {
    this.items.push(item);
  }

  public removeItem(): T | undefined {
    return this.items.pop();
  }

  public removeAll(): T[] {
    let retArr: T[] = this.items.slice();
    this.items.length = 0;
    return retArr;
  }
  //https://java2blog.com/clear-array-typescript/
}

export class Dresser<T, U, V> {
  public top: Drawer<T> = new Drawer<T>();
  public middle: Drawer<U> = new Drawer<U>();
  public bottom: Drawer<V> = new Drawer<V>();
}
function testDresser() {
  let dresserA: Dresser<Socks, Shirt, Pants> = new Dresser<
    Socks,
    Shirt,
    Pants
  >();

  let dresserB: Dresser<Socks, Socks, Socks> = new Dresser<
    Socks,
    Socks,
    Socks
  >();
  let socks1: Socks = { style: "short", color: "red" };
  let socks2: Socks = { style: "short", color: "blue" };
  let socks3: Socks = { style: "tall", color: "heliotrope" };
  let shirt1: Shirt = { style: "v-neck", size: "XL" };
  let shirt2: Shirt = { style: "long-sleeve", size: "XXL" };
  let pants1: Pants = { waist: 55, length: 126 };
  console.log(`DresserA Top: ${dresserA.top.isEmpty()}`);
  dresserA.top.addItem(socks1);
  dresserA.middle.addItem(shirt1);
  dresserA.middle.addItem(shirt2);
  dresserA.bottom.addItem(pants1);
  console.log(`DresserA Top: ${dresserA.top.isEmpty()}`);
  //dresserA.middle.addItem(socks); causes an error, hooray!
  console.log(`Removing ${dresserA.top.removeItem()?.color} from Dresser A`);
  console.log(`DresserA Top: ${dresserA.top.isEmpty()}`);
  dresserB.top.addItem(socks3);
  dresserB.top.addItem(socks2);
  dresserB.middle.addItem(socks2);
  dresserB.bottom.addItem(socks3);
  console.log(`DresserB Top: ${dresserB.top.isEmpty()}`);
  console.log("Removing all from DresserB Top...");
  let returnArr: Array<Socks> = dresserB.top.removeAll();
  returnArr.forEach((value) => {
    console.log(value.color);
  });
}

testDresser();
