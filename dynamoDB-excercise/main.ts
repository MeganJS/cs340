import { User } from "./entities";
import { FollowsDAO } from "./FollowsDAO";

class Main {
  async run() {
    const followsDAO = new FollowsDAO();

    for (let i: number = 0; i < 25; i++) {
      let follower: User = new User("@Jay", "Jay");
      let name: string = String.fromCharCode("a".charCodeAt(0) + i);
      let handle: string = "@" + name;
      let followee: User = new User(handle, name);
      await followsDAO.putFollow(follower, followee);
    }

    for (let i: number = 0; i < 25; i++) {
      let followee: User = new User("@Kay", "Kay");
      let name: string = String.fromCharCode("A".charCodeAt(0) + i);
      let handle: string = "@" + name;
      let follower: User = new User(handle, name);
      await followsDAO.putFollow(follower, followee);
    }

    console.log(await followsDAO.getFollow(new User("@Jay", "Jay")));

    //add cleanup here
    //await Promise.all([]);
  }
}

function run() {
  new Main().run();
}
run();
