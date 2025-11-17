import { YardOrnamentProvider } from "../YardOrnamentProvider";

export class HalloweenYardOrnamentProvider implements YardOrnamentProvider {
  getOrnament(): string {
    return "jack-o-lantern";
  }
}
