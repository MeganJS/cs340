import { FlightFeed } from "./FlightFeed";
import { Observer, StatusObserver, DeltaObserver } from "./entity/Observer";

main();

function main() {
  let feed = new FlightFeed();
  feed.attach(new StatusObserver);
  feed.attach(new DeltaObserver);
  feed.start();
}
