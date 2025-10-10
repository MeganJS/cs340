import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { AuthToken, User } from "tweeter-shared";
import { useParams } from "react-router-dom";
import UserItem from "../userItem/UserItem";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import {
  UserItemPresenter,
  UserItemView,
} from "../../presenter/UserItemPresenter";

//moved to FolloweePresenter
export const PAGE_SIZE = 10;

interface Props {
  //itemDescription: string;
  featureURL: string;
  /*
  loadMore: (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastUserItem: User | null
  ) => Promise<[User[], boolean]>;
   */
  presenterFactory: (view: UserItemView) => UserItemPresenter;
}

const UserItemScroller = (props: Props) => {
  const { displayErrorMessage } = useMessageActions();
  const [items, setItems] = useState<User[]>([]);
  //moved to FolloweePresenter because only used for presenter functions
  //const [hasMoreItems, setHasMoreItems] = useState(true);
  //const [lastItem, setLastItem] = useState<User | null>(null);
  //

  //Moved to observer object below
  //const addItems = (newItems: User[]) =>
  //  setItems((previousItems) => [...previousItems, ...newItems]);
  //

  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

  const observer: UserItemView = {
    addItems: (newItems: User[]) =>
      setItems((previousItems) => [...previousItems, ...newItems]),
    displayErrorMessage: displayErrorMessage,
  };

  const presenter = props.presenterFactory(observer);

  // Update the displayed user context variable whenever the displayedUser url parameter changes. This allows browser forward and back buttons to work correctly.
  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam != displayedUser!.alias
    ) {
      getUser(authToken!, displayedUserAliasParam!).then((toUser) => {
        if (toUser) {
          setDisplayedUser(toUser);
        }
      });
    }
  }, [displayedUserAliasParam]);

  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    reset();
    loadMoreItems();
  }, [displayedUser]);

  const reset = async () => {
    setItems(() => []);
    presenter.reset();
    //setLastItem(() => null);
    //setHasMoreItems(() => true);
  };

  //moved to FolloweePresenter
  const loadMoreItems = async () => {
    presenter.loadMoreItems(authToken!, displayedUser!.alias);
    /*
    try {
      const [newItems, hasMore] = await props.loadMore(
        authToken!,
        displayedUser!.alias,
        PAGE_SIZE,
        lastItem
      );

      setHasMoreItems(() => hasMore);
      setLastItem(() => newItems[newItems.length - 1]);
      addItems(newItems);
    } catch (error) {
      displayErrorMessage(
        `Failed to load ${props.itemDescription} because of exception: ${error}`
      );
    }
      */
  };

  //moved over to UserService, FolloweePresenter
  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    return presenter.getUser(authToken, alias);
  };

  return (
    <>
      <div className="container px-0 overflow-visible vh-100">
        <InfiniteScroll
          className="pr-0 mr-0"
          dataLength={items.length}
          next={() => loadMoreItems()}
          hasMore={presenter.hasMoreItems}
          loader={<h4>Loading...</h4>}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="row mb-3 mx-0 px-0 border rounded bg-white"
            >
              <UserItem user={item} featurePath={props.featureURL} />
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </>
  );
};

export default UserItemScroller;
