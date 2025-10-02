import OAuthItem from "./OAuthItem";

const OAuth = () => {
  return (
    <>
      <div className="text-center mb-3">
        <OAuthItem id="googleTooltip" icon={["fab", "google"]} name="Google" />
        <OAuthItem
          id="facebookTooltip"
          icon={["fab", "facebook"]}
          name="Facebook"
        />
        <OAuthItem
          id="twitterTooltip"
          icon={["fab", "twitter"]}
          name="Twitter"
        />
        <OAuthItem
          id="linkedInTooltip"
          icon={["fab", "linkedin"]}
          name="LinkedIn"
        />
        <OAuthItem id="githubTooltip" icon={["fab", "github"]} name="GitHub" />
      </div>
    </>
  );
};

export default OAuth;
