import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import { toast } from "react-toastify";
import { useClient } from "../context/context";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [location, setLocation] = useState(false);

  const {
    isAuthenticated,
    setIsAuthenticated,
    user,
    setProfileMenu,
    profileMenu,
  } = useClient();

  const navigate = useNavigate();

  useEffect(() => {
    const handleLocation = () => {
      const newWidth = window.innerWidth;

      if (newWidth <= 1250) {
        setLocation(true);
      } else {
        setLocation(false);
      }
    };
    window.addEventListener("resize", handleLocation);
  });

  // console.log('window location', location)

  const handleLogout = async () => {
    await axios
      .get("http://localhost:3601/api/v1/user/rider/logout", {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        // console.log("res.data.message", res.data.message);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        console.log("err.response.data.message", err.response.data.message);
      });
  };

  const goToLogin = () => {
    setShow(!show);
    navigate("/login");
  };

  const goToSignUp = () => {
    setShow(!show);
    navigate("/register");
  };

  const handleProfileMenu = () => {
    setProfileMenu(!profileMenu);
  };

  return (
    <>
      <nav className={`container ${profileMenu ? "sticky" : ""}`}>
        <div className="logo">
          <img src="logo.jpg" alt="logo" className="logo-img" />
        </div>
        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            <Link to={"/"} onClick={() => setShow(!show)}>
              Home
            </Link>
            <Link to={"/about"} onClick={() => setShow(!show)}>
              About Us
            </Link>
            <Link to={"/cardetail"} onClick={() => setShow(!show)}>
              Cars
            </Link>
            <Link to={"/testDrive"} onClick={() => setShow(!show)}>
              TestDrive
            </Link>

            <Link
              className="admin-login"
              // to={"https://4wheel-admin-frontend.netlify.app/"}
              to={"http://localhost:5173"}
              target="_blank"
              rel="noopener noreferrer" // Recommended for security and performance
              onClick={() => setShow(!show)}
            >
              Admin Login
            </Link>
          </div>
          {isAuthenticated ? (
            <>
              <div className="in-navbar">
                <img
                  src={user.photo.url}
                  alt="User Profile Image"
                  onClick={handleProfileMenu}
                />
              </div>
              <div className="user-logout-div">
                <button className="logoutBtn btn" onClick={handleLogout}>
                  LOGOUT
                </button>
              </div>
            </>
          ) : (
            <div className="links">
              <button className="loginBtn btn" onClick={goToSignUp}>
                Sign Up
              </button>
              <button className="loginBtn btn" onClick={goToLogin}>
                LOGIN
              </button>
            </div>
          )}
        </div>
        <div className="hamburger">
          {isAuthenticated ? (
            <div className="out-navmenu">
              <img
                src={user.photo.url}
                alt="User Profile Image"
                onClick={handleProfileMenu}
              />
            </div>
          ) : (
            ""
          )}
          <GiHamburgerMenu onClick={() => setShow(!show)} />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
