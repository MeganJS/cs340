import { DecorationPlacer } from "./decoration/DecorationPlacer";
import { HalloweenDecorProviderFactory } from "./holiday/Halloween/HalloweenDecorProviderFactory";
import { ThanksgivingDecorProviderFactory } from "./holiday/Thanksgiving/ThanksgivingDecorProviderFactory";

main();

function main(): void {
  let decorationPlacer = new DecorationPlacer(
    new HalloweenDecorProviderFactory()
  );
  console.log(decorationPlacer.placeDecorations());

  decorationPlacer = new DecorationPlacer(
    new ThanksgivingDecorProviderFactory()
  );
  console.log(decorationPlacer.placeDecorations());
}
