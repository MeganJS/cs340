import "isomorphic-fetch";
import "jest";
import { ServerFacade } from "../../src/network/ServerFacade";
import { User } from "tweeter-shared";

describe("ServerFacade tests", () => {
  const server: ServerFacade = new ServerFacade();

  test("register new user", async () => {
    const [user, authToken] = await server.authenticate(
      {
        firstName: "firstName",
        lastName: "lastName",
        alias: "alias",
        password: "password",
        imageStringBase64: "imageStringBase64",
        imageFileExtension: "imageFileExtension",
      },
      "register",
      "Invalid registration"
    );
    //server.register();
    //{"firstName":"Allen","lastName":"Anderson","alias":"@allen","imageUrl":"https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"}
    const expectedUser: User = new User(
      "Allen",
      "Anderson",
      "@allen",
      "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
    );
    expect(user).toEqual<User>(expectedUser);
    expect(authToken).not.toBeNull();
  });

  test("get followers with no lastItem", async () => {
    const [items, hasMore] = await server.getMoreFollowItems(
      {
        token: "token value",
        alias: "userAlias",
        pageSize: 10,
        lastItem: null,
      },
      "follower"
    );
    //server.register();
    //{"firstName":"Allen","lastName":"Anderson","alias":"@allen","imageUrl":"https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"}
    const expectedUser: User = new User(
      "Allen",
      "Anderson",
      "@allen",
      "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
    );
    expect(items[0]).toEqual<User>(expectedUser);
    expect(hasMore).toBe(true);
  });

  test("get followers with lastItem", async () => {
    const lastUser: User = new User(
      "Allen",
      "Anderson",
      "@allen",
      "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
    );
    const [items, hasMore] = await server.getMoreFollowItems(
      {
        token: "token value",
        alias: "userAlias",
        pageSize: 10,
        lastItem: lastUser.DTO,
      },
      "follower"
    );
    //server.register();
    //{"firstName":"Allen","lastName":"Anderson","alias":"@allen","imageUrl":"https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"}
    const expectedUser: User = new User(
      "Amy",
      "Ames",
      "@amy",
      "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/daisy_duck.png"
    );
    expect(items[0]).toEqual<User>(expectedUser);
    expect(hasMore).toBe(true);
  });
});
