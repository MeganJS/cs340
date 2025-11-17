import { WallHangingProvider } from "../WallHangingProvider";

export class HalloweenWallHangingProvider implements WallHangingProvider {
  getHanging(): string {
    return "spider-web";
  }
}
