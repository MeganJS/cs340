//import * as fs from "fs";
const fs = require("fs");

interface Array2D<T> {
  set(row: number, col: number, value: T): void;
  get(row: number, col: number): T;
}

export class Array2DNumber implements Array2D<number> {
  array: number[][];
  file_name: string;
  public constructor(
    num_rows: number = 1,
    num_cols: number = 1,
    file_name: string = ""
  ) {
    this.file_name = file_name;
    this.array = [];

    for (var y: number = 0; y < num_rows; y++) {
      this.array[y] = [];
      for (var x: number = 0; x < num_cols; x++) {
        const tempArr = this.array[y];
        if (tempArr != undefined) {
          tempArr[x] = 0;
        }
      }
    }
  }

  public set(row: number, col: number, value: number): void {
    //console.log("setting...");
    const tempArr = this.array[row];
    if (tempArr != undefined) {
      if (col < tempArr.length) {
        tempArr[col] = value;
        return;
      }
    }
    console.log("error: setting index out of bounds");
  }

  public get(row: number, col: number): number {
    //console.log("getting...");
    const tempArr = this.array[row];
    if (tempArr != undefined) {
      if (col < tempArr.length) {
        return tempArr[col]!;
      }
    }
    console.log("error: getting index out of bounds");
    return -1;
  }

  public save(fileName: string): void {
    let jString = JSON.stringify(this.array);
    fs.writeFileSync(fileName, jString, "utf-8");
  }

  public load(fileName: string) {
    let jString = fs.readFileSync(fileName, "utf-8");
    this.array = JSON.parse(jString);
  }
}
