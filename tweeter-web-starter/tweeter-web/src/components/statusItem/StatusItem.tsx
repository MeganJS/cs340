import { useContext } from "react";
import { Link } from "react-router-dom";
import Post from "./Post";
import {Status} from "tweeter-shared";

interface Props {
    status: Status;
}

const StatusItem = (props: Props) => {


    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();
    
        try {
          const alias = extractAlias(event.target.toString());
    
          const toUser = await getUser(authToken!, alias);
    
          if (toUser) {
            if (!toUser.equals(displayedUser!)) {
              setDisplayedUser(toUser);
              navigate(`/story/${toUser.alias}`);
            }
          }
        } catch (error) {
          displayToast(
            ToastType.Error,
            `Failed to get user because of exception: ${error}`,
            0
          );
        }
      };
    

    return (
        <div className="col bg-light mx-0 px-0">
            <div className="container px-0">
                <div className="row mx-0 px-0">
                  <div className="col-auto p-3">
                    <img
                      src={props.status.user.imageUrl}
                      className="img-fluid"
                      width="80"
                      alt="Posting user"
                    />
                  </div>
                  <div className="col">
                    <h2>
                      <b>
                        {props.status.user.firstName} {props.status.user.lastName}
                      </b>{" "}
                      -{" "}
                      <Link
                        to={`/story/${props.status.user.alias}`} //should be feed or story
                        onClick={navigateToUser}
                      >
                        {props.status.user.alias}
                      </Link>
                    </h2>
                    {props.status.formattedDate}
                    <br />
                    <Post status={props.status} featurePath="/story" />
                  </div>
                </div>
              </div>
            </div>
    );
};

export default StatusItem;
