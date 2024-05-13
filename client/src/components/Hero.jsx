import React, {useContext,useState,useEffect } from "react";
import {useClient} from "../context/context";
import ProfileMenu from "./ProfileMenu";

const Hero = ({ title, imageUrl }) => {
  const {
    profileMenu,
  } = useClient();
  
  return (
    <>
      <div className="hero container">
        <div className="banner">
          <h1>{title}</h1>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi
            explicabo temporibus, fugiat inventore nobis ipsa tempora tempore
            voluptates ratione cumque ducimus quam illum veniam consequatur
            magni sapiente. Molestiae, alias quasi. Lorem ipsum, dolor sit amet
            consectetur adipisicing elit. Harum repudiandae nostrum aliquam
            quaerat vitae sapiente cum, magni iste nulla esse illo a error
            necessitatibus saepe at laudantium id similique sequi!
          </p>
        </div>
        <div className="banner">
          <img src={imageUrl} alt="hero" className="animated-image" />
          <span>
            <img src="/Vector.png" alt="vector" />
          </span>
        </div>
      </div>
      {profileMenu && <ProfileMenu />}
    </>
  );
};

export default Hero;

