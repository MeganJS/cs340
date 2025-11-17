import { HolidayDecorProviderFactory } from "../HolidayDecorProviderFactory";
import { HalloweenTableclothPatternProvider } from "./HalloweenTableclothPatternProvider";
import { HalloweenWallHangingProvider } from "./HalloweenWallHangingProvider";
import { HalloweenYardOrnamentProvider } from "./HalloweenYardOrnamentProvider";

export class HalloweenDecorProviderFactory
  implements HolidayDecorProviderFactory
{
  public tableclothPatternProvider: HalloweenTableclothPatternProvider =
    new HalloweenTableclothPatternProvider();
  public wallHangingProvider: HalloweenWallHangingProvider =
    new HalloweenWallHangingProvider();
  public yardOrnamentProvider: HalloweenYardOrnamentProvider =
    new HalloweenYardOrnamentProvider();
}
