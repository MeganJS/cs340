import { DecorationPlacer } from "./decoration/DecorationPlacer";

main();

function main(): void {
  let decorationPlacer = new DecorationPlacer();

  console.log(decorationPlacer.placeDecorations());
}
