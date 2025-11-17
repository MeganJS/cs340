import { HolidayDecorProviderFactory } from "../HolidayDecorProviderFactory";
import { ThanksgivingTableclothPatternProvider } from "./ThanksgivingTableclothPatternProvider";
import { ThanksgivingWallHangingProvider } from "./ThanksgivingWallHangingProvider";
import { ThanksgivingYardOrnamentProvider } from "./ThanksgivingYardOrnamentProvider";

export class ThanksgivingDecorProviderFactory
  implements HolidayDecorProviderFactory
{
  public tableclothPatternProvider: ThanksgivingTableclothPatternProvider =
    new ThanksgivingTableclothPatternProvider();
  public wallHangingProvider: ThanksgivingWallHangingProvider =
    new ThanksgivingWallHangingProvider();
  public yardOrnamentProvider: ThanksgivingYardOrnamentProvider =
    new ThanksgivingYardOrnamentProvider();
}
