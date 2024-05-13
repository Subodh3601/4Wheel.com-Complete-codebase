import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useClient } from "../context/context";

const TestDriveForm = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useClient();
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState("");
  const [model, setModel] = useState("");

  const companyArray = [
    "Maruti",
    "Hyundai",
    "Tata",
    "Honda",
    "Kia",
    "Volkswagen",
    "Renault",
    "MGhector",
    "Audi",
  ];

  const [cars, setCars] = useState([]);
  useEffect(() => {
    const fetchCars = async () => {
      const { data } = await axios.get("http://localhost:3601/api/v1/cars/", {
        withCredentials: true,
      });
      setCars(data.cars);
      // console.log("ddddddddddddddddd", data)
      // console.log("aaaaaaaaaaaaaaaaaaaa",data.cars)
    };
    fetchCars();
  }, []);

  const bookTestDrive = async (e) => {
    e.preventDefault();
    try {
      // console.log("date",date)
      const { data } = await axios.post(
        "http://localhost:3601/api/v1/testdrive/book",
        {
          firstname,
          lastname,
          phone,
          date,
          time,
          location,
          company,
          model,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      window.scrollTo({ top: 0, behavior: "smooth" });
      // console.log("data.message", data.testDrive);
      // navigate("/testDrive");
      setFirstname("");
      setLastname("");
      setPhone("");
      setDate("");
      setTime("");
      setLocation("");
      setCompany("");
      setModel("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <div className="container form-component appointment-form">
        <h2>Test-Drive Form</h2>
        <form onSubmit={(e) => bookTestDrive(e)}>
          <div>
            <input
              type="text"
              placeholder="First Name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>
          <div>
            <input
              type="tel"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="text"
              placeholder="location of test drive"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <input
              type="date"
              placeholder="Date of test drive"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <input
              type="time"
              placeholder="time of test drive"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div>
            <select
              value={company}
              onChange={(e) => {
                setCompany(e.target.value);
                setModel("");
              }}
            >
              <option value="">Select company</option>
              {companyArray.map((name, index) => {
                return (
                  <option value={name} key={index}>
                    {name}
                  </option>
                );
              })}
            </select>
            <select
              value={model}
              onChange={(e) => {
                setModel(e.target.value);
              }}
              disabled={!company}
            >
              <option value="">Select model</option>
              {cars
                .filter((make) => make.company === company)
                .map((car, index) => (
                  <option value={car.model} key={index}>
                    {car.model}
                  </option>
                ))}
            </select>
          </div>

          <button type="submit" style={{ margin: "0 auto" }}>
            Book Test Drive
          </button>
        </form>
      </div>
    </>
  );
};

export default TestDriveForm;
