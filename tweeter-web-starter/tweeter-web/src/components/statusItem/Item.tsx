import { Link } from "react-router-dom";
import { User } from "tweeter-shared";
import { useUserNavigation } from "../userNavigate/UserNavigationHook";

interface Props<T> {
  item: T;
  user: User;
  featurePath: string;
  itemBodyFactory: (item: T) => JSX.Element;
}

const Item = <T,>(props: Props<T>) => {
  const { navigateToUser } = useUserNavigation();

  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <div className="col-auto p-3">
            <img
              src={props.user.imageUrl}
              className="img-fluid"
              width="80"
              alt="Posting user"
            />
          </div>
          <div className="col">
            <h2>
              <b>
                {props.user.firstName} {props.user.lastName}
              </b>{" "}
              -{" "}
              <Link
                to={`${props.featurePath}/${props.user.alias}`}
                onClick={navigateToUser}
              >
                {props.user.alias}
              </Link>
            </h2>
            {props.itemBodyFactory(props.item)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
