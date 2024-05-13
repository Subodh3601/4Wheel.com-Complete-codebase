import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useClient } from "../context/context";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Register = () => {
  const { isAuthenticated, setIsAuthenticated } = useClient();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState("");
  const [password, setPassword] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");

  const navigate = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("firstname", firstname);
      formData.append("lastname", lastname);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("photo", photo);
      formData.append("role", "user");
      // console.log("formDataaaaaaaa",formData)
      await axios
        .post("http://localhost:3601/api/v1/user/register", formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          console.log(res);
          toast.success(res.data.message);
          navigate("/login");
          setFirstname("");
          setLastname("");
          setEmail("");
          setPhone("");
          setPassword("");
          setPhoto("");
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handlePhotoUpload = (e) => {
    e.preventDefault();

    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPhotoPreview(reader.result);
    };
    setPhoto(file);
  };

  return (
    <>
      <div className="container form-component register-form">
        <h2>Sign Up</h2>
        <p>Please Sign Up To Continue</p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat culpa
          voluptas expedita itaque ex, totam ad quod error?
        </p>
        <form onSubmit={handleRegistration} encType="multipart/form-data">
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
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="tel"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                style={{ fontSize: "1.5rem", fontWeight: "500" }}
                htmlFor="userPhoto"
              >
                Upload Your Photo
              </label>
              <input id="userPhoto" type="file" onChange={handlePhotoUpload} />
            </div>
            <div style={{ width: "4rem", borderRadius: "50%" }}>
              <img src={photoPreview} />
            </div>
          </div>
          <div
            style={{
              gap: "10px",
              justifyContent: "flex-end",
              flexDirection: "row",
            }}
          >
            <p style={{ marginBottom: 0 }}>Already Registered?</p>
            <Link
              to={"/login"}
              style={{ textDecoration: "none", color: "#271776ca" }}
            >
              Login Now
            </Link>
          </div>
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
