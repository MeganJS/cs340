import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ToastType } from "../toaster/Toast";
import { ToastActionsContext } from "../toaster/ToastContexts";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface Props {
    id: string;
    icon: IconProp;
    name: string;
}


const OAuthItem = (props: Props) => {
        const { displayToast } = useContext(ToastActionsContext);
    
        const displayInfoMessageWithDarkBackground = (message: string): void => {
            displayToast(
            ToastType.Info,
            message,
            3000,
            undefined,
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