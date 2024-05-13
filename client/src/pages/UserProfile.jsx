import React, { useContext, useEffect, useState } from "react";
import { useClient } from "../context/context";
import { CiEdit } from "react-icons/ci";
import axios from "axios";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import ProfileMenu from "../components/ProfileMenu";

const UserProfile = () => {
  const { isAuthenticated, user, profileMenu } = useClient();
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    phone: user.phone,
  });
  const [testDriveData, setTestDriveData] = useState([]);

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const capitalizedFN = capitalizeFirstLetter(editData.firstname);
  const capitalizedLN = capitalizeFirstLetter(editData.lastname);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3601/api/v1/testdrive/rider/${user._id}`,
          {
            withCredentials: true,
          }
        );
        if (data.success) {
          // console.log("drivedata:", data.userTestDrive);
          setTestDriveData(data.userTestDrive);
        }
      } catch (error) {
        // console.log("error", error);
        // toast.error(error.response.data.message);
      }
    };

    fetchData();
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `http://localhost:3601/api/v1/user/updateprofile/${user._id}`,
        editData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      // console.log("datavvvvvvvvv", data);
      toast.success(data.message);
      // setEditData({
      //   firstname: "",
      //   lastname: "",
      //   phone: "",
      // });
      setShowEdit(false);
    } catch (error) {
      console.log("error", error);
      toast.error(error.response.data.message);
    }
  };

  const handleShowEdit = () => {
    setShowEdit(!showEdit);
    console.log("showEdit", showEdit);
  };

  const handleFirstNameChange = (e) => {
    setEditData({ ...editData, firstname: e.target.value });
  };

  const handleLastNameChange = (e) => {
    setEditData({ ...editData, lastname: e.target.value });
  };

  const handlePhoneChange = (e) => {
    setEditData({ ...editData, phone: e.target.value });
  };

  const handleClose = () => {
    setShowEdit(false);
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  console.log("testdrive", testDriveData);
  return (
    <>
      <div className="profile container">
        <div className="profile-heading">Welcome</div>
        <div className="profile-content">
          <div className="profile-card">
            <img src={user.photo.url} alt="profile photo" />
            <div className="user-name">
              {capitalizedFN} {capitalizedLN}
            </div>
          </div>
          <div className="profile-detail">
            <div className="button-outerdiv">
              <button type="button" onClick={handleShowEdit}>
                <CiEdit />
              </button>
            </div>

            <div className="profile-detail-outerdiv">
              <div className="profile-detail-innerdiv">
                <span>
                  {editData.firstname} {editData.lastname}
                </span>
              </div>
            </div>
            <div className="profile-detail-outerdiv">
              <div className="profile-detail-innerdiv">
                <span>{user.email}</span>
              </div>
            </div>
            <div className="profile-detail-outerdiv">
              <div className="profile-detail-innerdiv">
                <span>{editData.phone}</span>
              </div>
            </div>

            {testDriveData.length > 0 ? (
              testDriveData.map((testDrive, index) => (
                <div className="profile-detail-outerdiv">
                  <div className="profile-detail-innerdiv">
                    <span>
                      Rider Name: {testDrive.firstname} {testDrive.lastname}
                    </span>
                    <br />
                    <span>Rider Phone: {testDrive.phone}</span>
                    <br />
                    <span>
                      Date and Time: {testDrive.date} / {testDrive.time}
                    </span>
                    <br />
                    <span>Location: {testDrive.location}</span>
                    <br />
                    <span>
                      Company and Model: {testDrive.company} / {testDrive.model}
                    </span>
                    <br />
                    <span>
                      Status Of Test Drive Request:{" "}
                      <b
                        style={{
                          color:
                            testDrive.status === "Accepted"
                              ? "green"
                              : testDrive.status === "Pending"
                              ? "yellow"
                              : "red",
                        }}
                      >
                        {testDrive.status}
                      </b>
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="profile-detail-outerdiv">
                <div className="profile-detail-innerdiv">
                  <span>No Test Drive Booked</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showEdit && (
        <div className="edit-form-overlay">
          <div className="overlay-div">
            <form onSubmit={handleSubmit}>
              <div className="overlay-close" onClick={handleClose}>
                X
              </div>
              <label for="firstname">New First-Name:</label>

              <input
                id="firstname"
                type="text"
                placeholder={editData.firstname}
                value={editData.firstname}
                onChange={handleFirstNameChange}
              />
              <br />
              <label for="lastname">New Last-Name:</label>

              <input
                id="lastname"
                type="text"
                placeholder={editData.lastname}
                value={editData.lastname}
                onChange={handleLastNameChange}
              />
              <br />
              <label for="phone">New Phone N0.:</label>

              <input
                id="phone"
                type="tel"
                placeholder={editData.phone}
                value={editData.phone}
                onChange={handlePhoneChange}
              />
              <br />

              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

      {profileMenu && <ProfileMenu />}
    </>
  );
};

export default UserProfile;
