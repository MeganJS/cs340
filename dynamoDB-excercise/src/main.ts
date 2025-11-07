import { User } from "./entity/User";
import { FollowsDAO } from "./DAO/FollowsDAO";

class Main {
  async run() {
    const followsDAO = new FollowsDAO();

    try {
      /*
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
      */
      console.log(
        await followsDAO.getFollow(new User("@Jay", "Jay"), new User("@a", "a"))
      );

      await followsDAO.updateFollow(
        new User("@Jay", "Jay2"),
        new User("@a", "a2")
      );
      await followsDAO.deleteFollow(
        new User("@Jay", "Jay"),
        new User("@b", "b")
      );
      /*
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
        */
    } catch (e) {
      console.log(e);
    }

    //add cleanup here
    //await Promise.all([]);
  }
}

function run() {
  new Main().run();
}
run();
