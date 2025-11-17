import { HalloweenTableclothPatternProvider } from "../holiday/Halloween/HalloweenTableclothPatternProvider";
import { HalloweenWallHangingProvider } from "../holiday/Halloween/HalloweenWallHangingProvider";
import { HalloweenYardOrnamentProvider } from "../holiday/Halloween/HalloweenYardOrnamentProvider";

export class DecorationPlacer {
  // FIXME use dependency inversion to remove these hard-coded dependencies
  private tableclothPattern: HalloweenTableclothPatternProvider =
    new HalloweenTableclothPatternProvider();
  private wallHanging: HalloweenWallHangingProvider =
    new HalloweenWallHangingProvider();
  private yardOrnament: HalloweenYardOrnamentProvider =
    new HalloweenYardOrnamentProvider();

  placeDecorations(): string {
    return (
      "Everything was ready for the party. The " +
      this.yardOrnament.getOrnament() +
      " was in front of the house, the " +
      this.wallHanging.getHanging() +
      " was hanging on the wall, and the tablecloth with " +
      this.tableclothPattern.getTablecloth() +
      " was spread over the table."
    );
  }
}
