import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useMessageActions } from "../toaster/MessageHooks";

interface Props {
    id: string;
    icon: IconProp;
    name: string;
}


const OAuthItem = (props: Props) => {
        const { displayInfoMessage } = useMessageActions();
    
        const displayInfoMessageWithDarkBackground = (message: string): void => {
            displayInfoMessage(
            message,
            3000,
            "text-white bg-primary"
            );
        };

    return (
        <>
            <button
              type="button"
              className="btn btn-link btn-floating mx-1"
              onClick={() =>
                displayInfoMessageWithDarkBackground(
                  `${props.name} registration is not implemented.`
                )
              }
            >
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={props.id}>{props.name}</Tooltip>}
              >
                <FontAwesomeIcon icon={props.icon} />
              </OverlayTrigger>
            </button>
        </>
    );
};

export default OAuthItem;