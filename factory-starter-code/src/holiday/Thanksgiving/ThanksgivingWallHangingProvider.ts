import { WallHangingProvider } from "../WallHangingProvider";

export class ThanksgivingWallHangingProvider implements WallHangingProvider {
  getHanging(): string {
    return "string of colorful leaves";
  }
}
