import "isomorphic-fetch";
import "jest";
import { StatusService } from "../../src/model.service/StatusService";
import { AuthToken, Status, User } from "tweeter-shared";

describe("StatusService tests", () => {
  const service: StatusService = new StatusService();

  test("get story items with no lastItem", async () => {
    const authToken: AuthToken = new AuthToken("abc123", Date.now());

    const [items, hasMore] = await service.loadMoreStatusItems(
      authToken,
      "alias",
      10,
      null,
      "story"
    );

    const statusUser: User = new User(
      "Allen",
      "Anderson",
      "@allen",
      "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
    );
    /*
    {
      "post": "Post 0 0\n        My friend @amy likes this website: http://byu.edu. Do you? \n        Or do you prefer this one: http://cs.byu.edu?",
      "user": {
        "firstName": "Allen",
        "lastName": "Anderson",
        "alias": "@allen",
        "imageUrl": "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
      },
      "timestamp": 0
    },
    */

    const expectedStatus: Status = new Status(
      "Post 0 0\n        My friend @amy likes this website: http://byu.edu. Do you? \n        Or do you prefer this one: http://cs.byu.edu?",
      statusUser,
      0
    );
    expect(items[0]).toEqual<Status>(expectedStatus);
    expect(hasMore).toBe(true);
  });

  test("get story items with lastItem", async () => {
    const authToken: AuthToken = new AuthToken("abc123", Date.now());
    const statusUser: User = new User(
      "Allen",
      "Anderson",
      "@allen",
      "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
    );

    const lastStatus: Status = new Status(
      "Post 0 0\n        My friend @amy likes this website: http://byu.edu. Do you? \n        Or do you prefer this one: http://cs.byu.edu?",
      statusUser,
      0
    );

    const [items, hasMore] = await service.loadMoreStatusItems(
      authToken,
      "alias",
      10,
      lastStatus,
      "story"
    );

    const expectedUser: User = new User(
      "Amy",
      "Ames",
      "@amy",
      "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/daisy_duck.png"
    );
    const expectedStatus: Status = new Status(
      "Post 0 1\n        My friend @bob likes this website: http://byu.edu. Do you? \n        Or do you prefer this one: http://cs.byu.edu?",
      expectedUser,
      30000000000
    );

    /*
    {
      "post": "Post 0 1\n        My friend @bob likes this website: http://byu.edu. Do you? \n        Or do you prefer this one: http://cs.byu.edu?",
      "user": {
        "firstName": "Amy",
        "lastName": "Ames",
        "alias": "@amy",
        "imageUrl": "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/daisy_duck.png"
      },
      "timestamp": 30000000000
    },
    */

    expect(items[0]).toEqual<Status>(expectedStatus);
    expect(hasMore).toBe(true);
  });
});
