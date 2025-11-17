import { TableclothPatternProvider } from "./TableclothPatternProvider";
import { WallHangingProvider } from "./WallHangingProvider";
import { YardOrnamentProvider } from "./YardOrnamentProvider";

export interface HolidayDecorProviderFactory {
  tableclothPatternProvider: TableclothPatternProvider;
  wallHangingProvider: WallHangingProvider;
  yardOrnamentProvider: YardOrnamentProvider;
}
