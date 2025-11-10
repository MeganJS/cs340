import { User } from "./entity/User";
import { FollowsDAO } from "./DAO/FollowsDAO";
import { DataPage } from "./entity/DataPage";
import { Follows } from "./entity/Follows";

class Main {
  async run() {
    const followsDAO = new FollowsDAO();

    try {
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

      //
      //Print pages of Followees
      let dataPageFollowees: DataPage<Follows> =
        await followsDAO.getPageOfFollowees("@Jay", 10, undefined);

      dataPageFollowees.values.forEach((value) =>
        console.log(value.toString())
      );
      console.log();
      //Second page followees
      let lastFolloweeHandle: string | undefined = "";
      const lastFollowee =
        dataPageFollowees.values[dataPageFollowees.values.length - 1];

      if (lastFollowee === undefined) {
        lastFolloweeHandle = undefined;
      } else {
        lastFolloweeHandle = lastFollowee.followeeUser.handle;
      }
      console.log("Page 2");
      dataPageFollowees = await followsDAO.getPageOfFollowees(
        "@Jay",
        10,
        lastFolloweeHandle
      );

      dataPageFollowees.values.forEach((value) =>
        console.log(value.toString())
      );
      console.log();

      let dataPageFollowers: DataPage<Follows> =
        await followsDAO.getPageOfFollowers("@Kay", 10, undefined);

      dataPageFollowers.values.forEach((value) =>
        console.log(value.toString())
      );
      console.log();

      let lastFollowerHandle: string | undefined = "";
      const lastFollower =
        dataPageFollowers.values[dataPageFollowers.values.length - 1];

      if (lastFollower === undefined) {
        lastFollowerHandle = undefined;
      } else {
        lastFollowerHandle = lastFollower.followerUser.handle;
      }
      console.log("Page 2");
      dataPageFollowers = await followsDAO.getPageOfFollowers(
        "@Kay",
        10,
        lastFollowerHandle
      );

      dataPageFollowers.values.forEach((value) =>
        console.log(value.toString())
      );
      console.log();

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
