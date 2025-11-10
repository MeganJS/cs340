import { User } from "./User";

export class Follows {
  followerUser: User;
  followeeUser: User;

  constructor(followerUser: User, followeeUser: User) {
    this.followerUser = followerUser;
    this.followeeUser = followeeUser;
  }

  toString(): string {
    return `Follower: ${this.followerUser.toString()}, Followee: ${this.followeeUser.toString()}`;
  }
}
