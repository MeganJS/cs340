import { TableclothPatternProvider } from "../holiday/TableclothPatternProvider";
import { WallHangingProvider } from "../holiday/WallHangingProvider";
import { YardOrnamentProvider } from "../holiday/YardOrnamentProvider";

export class DecorationPlacer {
  // FIXME use dependency inversion to remove these hard-coded dependencies
  private tableclothPattern: TableclothPatternProvider;
  private wallHanging: WallHangingProvider;
  private yardOrnament: YardOrnamentProvider;

  constructor(
    tableClothPatternProvider: TableclothPatternProvider,
    wallHangingProvider: WallHangingProvider,
    yardOrnamentProvider: YardOrnamentProvider
  ) {
    this.tableclothPattern = tableClothPatternProvider;
    this.wallHanging = wallHangingProvider;
    this.yardOrnament = yardOrnamentProvider;
  }

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
