import { Array2DNumber } from "./Array2D";
import { Array2DProxy } from "./Array2DProxy";

function writeSaveFile() {
  let array = new Array2DNumber(5, 5, "pond.txt");
  for (var y: number = 0; y < 5; y++) {
    for (var x: number = 0; x < 5; x++) {
      array.set(y, x, (1 + x) * (1 + y));
    }
  }
  array.save("pond.txt");
}

function useProxyArray() {
  let array = new Array2DProxy("pond.txt");
  array.set(3, 3, 6);
  if (array.get(4, 4) == 25 && array.get(3, 3) == 6) {
    console.log("successfully loaded!");
  } else {
    console.log("not successfully loaded...");
  }
}

writeSaveFile();
useProxyArray();
