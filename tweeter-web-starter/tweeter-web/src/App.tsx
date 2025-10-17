import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import { useUserInfo } from "./components/userInfo/UserInfoHooks";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { PagedItemView } from "./presenter/PagedItemPresenter";
import { Status, User } from "tweeter-shared";
import ItemScroller from "./components/mainLayout/ItemScroller";
//import StatusItem from "./components/statusItem/StatusItem";
//import UserItem from "./components/userItem/UserItem";
import Item from "./components/statusItem/Item";
import Post from "./components/statusItem/Post";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfo();

  /*
  const statusItemComponentFactory = (item: Status, featureURL: string) => {
    return (
      <>
        <StatusItem status={item} featurePath={featureURL} />
      </>
    );
  };
  const userItemComponentFactory = (item: User, featureURL: string) => {
    return (
      <>
        <UserItem user={item} featurePath={featureURL} />
      </>
    );
  };
  */

  const statItemComponentFactory = (item: Status, featureURL: string) => {
    return (
      <>
        <Item
          item={item}
          user={item.user}
          featurePath={featureURL}
          itemBodyFactory={(item) => {
            return (
              <>
                {item.formattedDate}
                <br />
                <Post status={item} featurePath={featureURL} />
              </>
            );
          }}
        />
      </>
    );
  };

  const useItemComponentFactory = (item: User, featureURL: string) => {
    return (
      <>
        <Item
          item={item}
          user={item}
          featurePath={featureURL}
          itemBodyFactory={(item) => {
            return <></>;
          }}
        />
      </>
    );
  };

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          index
          element={<Navigate to={`/feed/${displayedUser!.alias}`} />}
        />
        <Route
          path="feed/:displayedUser"
          element={
            <ItemScroller
              key={`feed-${displayedUser!.alias}`}
              featureURL="/feed"
              presenterFactory={(view: PagedItemView<Status>) =>
                new FeedPresenter(view)
              }
              itemComponentFactory={statItemComponentFactory}
            />
          }
        />
        <Route
          path="story/:displayedUser"
          element={
            <ItemScroller
              key={`story-${displayedUser!.alias}`}
              featureURL="/story"
              presenterFactory={(view: PagedItemView<Status>) =>
                new StoryPresenter(view)
              }
              itemComponentFactory={statItemComponentFactory}
            />
          }
        />
        <Route
          path="followees/:displayedUser"
          element={
            <ItemScroller
              key={`followees-${displayedUser!.alias}`}
              featureURL="/followees"
              presenterFactory={(view: PagedItemView<User>) =>
                new FolloweePresenter(view)
              }
              itemComponentFactory={useItemComponentFactory}
            />
          }
        />
        <Route
          path="followers/:displayedUser"
          element={
            <ItemScroller
              key={`followers-${displayedUser!.alias}`}
              featureURL="/followers"
              presenterFactory={(view: PagedItemView<User>) =>
                new FollowerPresenter(view)
              }
              itemComponentFactory={useItemComponentFactory}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route
          path="*"
          element={<Navigate to={`/feed/${displayedUser!.alias}`} />}
        />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
