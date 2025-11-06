export class User {
  handle: string;
  name: string;

  constructor(handle: string, name: string) {
    this.handle = handle;
    this.name = name;
  }

  toString(): string {
    return `${this.handle} ${this.name}`;
  }
}
/*
export class Followee {
  followee_handle: string;
  followee_name: string;

  constructor(followee_handle: string, followee_name: string) {
    this.followee_handle = followee_handle;
    this.followee_name = followee_name;
  }

  toString(): string {
    return `@${this.followee_handle} ${this.followee_name}`;
  }
}
  */
