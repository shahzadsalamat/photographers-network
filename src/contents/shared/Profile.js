// dependencies
import React, { Component } from "react";
import fire from "../../config/Fire";
import { Link } from "react-router-dom";

// components
import { ProfileCard } from "../../components/ProfileCard";
import { LinkLists } from "../../components/LinkLists";


// contents
import { PhotographerContent } from "../photographer/PhotographerContent";
import CompanyContent from "../company/CompanyContent";
import LoadingPage from "../../components/LoadingPage";
import NavFooterWrapper from "./NavFooterWrapper";

class Profile extends Component {
  state = {
    pageLinks: [
      { txt: "Facebook", link: "www.facebook.com" },
      { txt: "Twitter", link: "www.twitter.com" }
    ],
    uid: this.props.match.params.uid || "",
    fetchedUserData: false,
    thisProfileData: null,
  };
  database = fire.database().ref();

  componentDidMount() {
    this.fetchUserInformation();
  }

  /**
   * Fetches user information from the database with the uid-param.
   */
  fetchUserInformation = () => {
    const { uid } = this.state;
    this.database
      .child("users")
      .child(uid)
      .once("value")
      .then(snap => {
        if (!snap.exists()) {
          this.props.history.replace("/");
          return -1;
        }
        let data = snap.val();

        const portofolio = data.portofolio
          ? Object.values(data.portofolio)
          : [];

        this.setState({
          thisProfileData: { ...data, portofolio: portofolio, uid: uid },
          fetchedUserData: true
        });
      });
  };

  render() {
    const { user, loading } = this.props;
    const { fetchedUserData, thisProfileData, uid, pageLinks } = this.state; //change currUser to thisProfileData
    let otherUser = true;
    let loaded = false;

    // looks if there is response from the current user
    // and the user data has been already fetched
    if (!loading && fetchedUserData) {
      if (user) {
        otherUser = user.uid !== thisProfileData.uid;
      }
      loaded = true;
    }

    return (
      <React.Fragment>
        {loaded ? (
          user ? ( //THIS USER IS THE LOGGEDIN USER NOT THE USER THAT USER THAT PROFILE WE ARE LOOKING AT
            <ProfileView
              thisProfileData={thisProfileData} //THIS USER IN PROFILEVIEW IS THE USER THAT PROFILE BELONGS TO NOT THE LOGGEDINONE!
              isOtherUser={otherUser}
              logoutHandler={this.logout}
              pageLinks={pageLinks}
              uid={uid}
              siggnedInUser={user}
            />

          ) : (
              <h2> NO SUCH PROFILE </h2>
            )
        ) : (
            <LoadingPage />
          )}
      </React.Fragment>
    );
  }
}

const ProfileView = ({
  isOtherUser,
  thisProfileData,
  pageLinks,
  siggnedInUser

}) => (
    <div>
      <div className="profile">
        <ProfileCard {...thisProfileData} siggnedInUser={siggnedInUser}>
          {thisProfileData.displayName}
        </ProfileCard>
        <div className="profile-content">
          <LinkLists
            links={pageLinks}
            txtClasses="gb-text-black-opacity-30 gb-subtitle-medium"
            liClasses="footer-nav-item"
          />
          <Link to="/ProfileEdit" className="gb-btn gb-btn-medium gb-btn-primary">
            Edit Profile
         </Link>
        </div>

        {thisProfileData.type === "photographer" ? (
          <PhotographerContent
            photographerData={thisProfileData}
            isOtherUser={isOtherUser}
          />
        ) : (
            <CompanyContent isOtherUser={isOtherUser} />
          )}

      </div>

    </div>
  );
export const ProfileWithNav = NavFooterWrapper(Profile);
