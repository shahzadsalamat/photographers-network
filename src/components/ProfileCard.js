import React from "react";
import PropTypes from "prop-types";
import { Avatar } from "./Avatar";
import { HireButton } from "./HireButton";

export const ProfileCard = ({
  backgroundImg = "https://images.unsplash.com/photo-1526080676457-4544bf0ebba9?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=981026b7c3ee99d54e0811e984995340",
  children,
  photoURL: profileImg,
  type,
  hireable,
  uid,
  siggnedInUser
}) => {
  return (
    <div className="gb-card-10-wrapper">
      {type === "photographer" &&
        hireable &&
        siggnedInUser.type === "company" && (
          <HireButton
            siggnedInUser={siggnedInUser}
            uid={uid}
            photographerName={children}
          />
        )}
      <div
        className="profile-card"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        <div className="card-10-shadow-overlay" />
        <div className="card-10-content">
          <h1 className="gb-title-xx-large gb-text-white">{children}</h1>
          <h3 className="gb-title-small gb-text-white">
            {type === "photographer" ? "Photographer" : "Company"}
          </h3>
          <Avatar
            userImageUrl={profileImg}
            classes="profile-avatar gb-avatar-x-large"
          />
        </div>
      </div>
    </div>
  );
};

ProfileCard.propTypes = {
  backgroundImg: PropTypes.string,
  photoURL: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  hireable: PropTypes.bool,
  uid: PropTypes.string.isRequired
};
