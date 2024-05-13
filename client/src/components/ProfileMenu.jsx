import axios from "axios";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useClient } from "../context/context";

const ProfileMenu = () => {
  const navigate = useNavigate();
  const { setProfileMenu, profileMenu, setIsAuthenticated } = useClient();

  const handleLogout = async () => {
    await axios
      .get("http://localhost:3601/api/v1/user/rider/logout", {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        // console.log("res.data.message", res.data.message);
        setIsAuthenticated(false);
        setProfileMenu(!profileMenu);
      })
      .catch((err) => {
        console.log("err.response.data.message", err.response.data.message);
        toast.error(err.response.data.message);
      });
  };

  const handleProfileMenu = () => {
    setProfileMenu(!profileMenu);
    navigate("/userprofile");
  };
  return (
    <div className="profile-menu">
      <ul>
        <li onClick={handleProfileMenu}>Profile</li>
        <li onClick={handleLogout}>Logout</li>
      </ul>
    </div>
  );
};

export default ProfileMenu;
