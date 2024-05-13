import React from "react";
import Hero from "../components/Hero";
import TestDriveForm from "../components/TestDriveForm";

const TestDrive = () => {
  return (
    <>
      <Hero
        title={"Schedule Your TestDrive | 4Wheel.com"}
        imageUrl={"/testdrivebook.png"}
      />
      <TestDriveForm />
    </>
  );
};

export default TestDrive;
