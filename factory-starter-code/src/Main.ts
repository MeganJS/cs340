import { DecorationPlacer } from "./decoration/DecorationPlacer";
import { HalloweenDecorProviderFactory } from "./holiday/Halloween/HalloweenDecorProviderFactory";

main();

function main(): void {
  let decorationPlacer = new DecorationPlacer(
    new HalloweenDecorProviderFactory()
  );

  console.log(decorationPlacer.placeDecorations());
}
