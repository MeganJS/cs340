import { TableclothPatternProvider } from "../TableclothPatternProvider";

export class ThanksgivingTableclothPatternProvider
  implements TableclothPatternProvider
{
  getTablecloth(): string {
    return "cornucopia";
  }
}
