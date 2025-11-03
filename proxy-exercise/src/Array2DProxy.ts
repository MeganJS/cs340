import { Array2DNumber } from "./Array2D";
const fs = require("fs");

export class Array2DProxy {
  //private array: Array2DNumber | null = null;
  private array: Array2DNumber = new Array2DNumber();
  private fileName: string;
  private notLoaded = true;

  constructor(fileName: string) {
    this.fileName = fileName;
  }

  set(row: number, col: number, value: number): void {
    if (this.notLoaded) {
      this.array.load(this.fileName);
      this.notLoaded = false;
    }
    this.array.set(row, col, value);
  }

  get(row: number, col: number): number {
    if (this.notLoaded) {
      this.array.load(this.fileName);
      this.notLoaded = false;
    }

    return this.array.get(row, col);
  }

  save(fileName: string): void {
    if (this.notLoaded) {
      this.array.load(this.fileName);
      this.notLoaded = false;
    }
    let jString = JSON.stringify(this.array);
    fs.writeFileSync(fileName, jString, "utf-8");
  }

  load(fileName: string) {
    let jString = fs.readFileSync(fileName, "utf-8");
    this.array = JSON.parse(jString);
  }
}
