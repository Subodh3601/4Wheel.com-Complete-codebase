import React from "react";
import Hero from "../components/Hero";
import Biography from "../components/Biography";


const AboutUs = () => {
  return (
    <>
      <Hero
        title={"Learn More About Us | 4Wheel.com"}
        imageUrl={"/about1.jpg"}
      />
      <Biography imageUrl={"/whoweare.png"} />
    </>
  );
};

export default AboutUs;
