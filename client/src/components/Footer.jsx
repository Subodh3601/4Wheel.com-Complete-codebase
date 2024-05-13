import React from "react";
import { Link } from "react-router-dom";
import { FaLocationArrow, FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      <footer className={"container"}>
        <hr />
        <div className="content">
          <div>
            <img src="logo.jpg" alt="logo" className="logo-img" />
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul>
              <Link to={"/"} onClick={handleScrollToTop}>
                Home
              </Link>
              <Link to={"/testDrive"}>TestDrive</Link>
              <Link to={"/about"}>About</Link>
            </ul>
          </div>

          <div></div>

          <div>
            <h4>Contact</h4>
            <div>
              <FaPhone />
              <span>999-999-9999</span>
            </div>
            <div>
              <MdEmail />
              <span>4Wheel.com</span>
            </div>
            <div>
              <FaLocationArrow />
              <span>Mumbai, India</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
