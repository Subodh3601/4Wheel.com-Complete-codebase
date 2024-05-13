import React, { useContext, useState } from "react";
import { TiHome } from "react-icons/ti";
import { RiAdminFill, RiLogoutCircleLine } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { LiaCarSideSolid } from "react-icons/lia";
import { IoCarSportSharp } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { useAdmin } from "../context/context";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [show, setShow] = useState(false);

  const { isAuthenticated, setIsAuthenticated } = useAdmin();

  const handleLogout = async () => {
    await axios
      .get("http://localhost:3601/api/v1/user/admin/logout", {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const navigateTo = useNavigate();

  const gotoHomePage = () => {
    navigateTo("/dashboard");
    setShow(!show);
  };
  const gotoCarsPage = () => {
    navigateTo("/cars");
    setShow(!show);
  };
  const gotoMessagesPage = () => {
    navigateTo("/messages");
    setShow(!show);
  };
  const gotoAddNewCar = () => {
    navigateTo("/cars/addnew");
    setShow(!show);
  };
  const gotoAddNewAdmin = () => {
    navigateTo("/admin/addnew");
    setShow(!show);
  };

  return (
    <>
      <nav
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
        className={show ? "show sidebar" : "sidebar"}
      >
        <div className="links">
          <TiHome onClick={gotoHomePage} />
          <h3 onClick={gotoHomePage}>Home</h3>
          <IoCarSportSharp onClick={gotoCarsPage} />
          <h3 onClick={gotoCarsPage}>Cars List</h3>
          <RiAdminFill onClick={gotoAddNewAdmin} />
          <h3 onClick={gotoAddNewAdmin}>Add Admin</h3>
          <LiaCarSideSolid onClick={gotoAddNewCar} />
          <h3 onClick={gotoAddNewCar}>Add Car</h3>
          <AiFillMessage onClick={gotoMessagesPage} />
          <h3 onClick={gotoMessagesPage}>Messages</h3>
          <RiLogoutCircleLine onClick={handleLogout} />
          <h3 onClick={handleLogout}>Logout</h3>
        </div>
      </nav>
      <div
        className="wrapper"
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
      >
        <GiHamburgerMenu className="hamburger" onClick={() => setShow(!show)} />
      </div>
    </>
  );
};

export default Sidebar;
