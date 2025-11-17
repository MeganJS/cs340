import { TableclothPatternProvider } from "../TableclothPatternProvider";

export class HalloweenTableclothPatternProvider
  implements TableclothPatternProvider
{
  getTablecloth(): string {
    return "ghosts and skeletons";
  }
}
