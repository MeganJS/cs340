import { YardOrnamentProvider } from "../YardOrnamentProvider";

export class ThanksgivingYardOrnamentProvider implements YardOrnamentProvider {
  getOrnament(): string {
    return "inflatable turkey";
  }
}
