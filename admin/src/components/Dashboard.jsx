import React, { useEffect, useState } from "react";
import { useAdmin } from "../context/context";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { RiDeleteBin3Line } from "react-icons/ri";

const Dashboard = () => {
  const [testDrive, setTestDrive] = useState([]);
  const [cars, setCars] = useState([]);
  const { isAuthenticated, admin } = useAdmin();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data } = await axios.get("http://localhost:3601/api/v1/cars/", {
          withCredentials: true,
        });
        setCars(data.cars);
      } catch (error) {
        setCars([]);
      }
    };
    fetchCars();
  }, [cars]);

  useEffect(() => {
    const fetchTestDrives = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3601/api/v1/testdrive/",
          { withCredentials: true }
        );
        setTestDrive(data.requestedTestDrive);
        // console.log("testdrive", data.requestedTestDrive);
      } catch (error) {
        setTestDrive([]);
      }
    };
    fetchTestDrives();
  }, [testDrive]);

  const handleUpdateStatus = async (testDriveId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:3601/api/v1/testdrive/updatestatus/${testDriveId}`,
        { status },
        { withCredentials: true }
      );
      setTestDrive((prev) =>
        prev.map((test) =>
          test._id === testDriveId ? { ...test, status } : test
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:3601/api/v1/testdrive/delete/${id}`,
        { withCredentials: true }
      );

      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src="/user.png" alt="docImg" />
            <div className="content">
              <div>
                <p>Hello ,</p>
                <h5>{admin && `${admin.firstname} ${admin.lastname}`} </h5>
              </div>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Facilis, nam molestias. Eaque molestiae ipsam commodi neque.
                Assumenda repellendus necessitatibus itaque.
              </p>
            </div>
          </div>
          <div className="secondBox">
            <p>Total Test Drive Requests</p>
            <h3>{testDrive.length}</h3>
          </div>
          <div className="thirdBox">
            <p>Total cars with US</p>
            <h3>{cars.length}</h3>
          </div>
        </div>
        <div className="banner">
          <h5>Test Drives</h5>
          <table>
            <thead>
              <tr>
                <th>Rider</th>
                <th>Date</th>
                <th>Time</th>
                <th>Company</th>
                <th>Model</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {testDrive && testDrive.length > 0
                ? testDrive.map((test) => (
                    <tr key={test._id}>
                      <td>{`${test.firstname} ${test.lastname}`}</td>
                      <td>{test.date}</td>
                      <td>{test.time}</td>
                      <td>{test.company}</td>
                      <td>{test.model}</td>
                      <td>{test.status}</td>
                      <td>
                        <select
                          className={
                            test.status === "Pending"
                              ? "value-pending"
                              : test.status === "Accepted"
                              ? "value-accepted"
                              : "value-rejected"
                          }
                          value={test.status}
                          onChange={(e) =>
                            handleUpdateStatus(test._id, e.target.value)
                          }
                        >
                          <option value="Pending" className="value-pending">
                            Pending
                          </option>
                          <option value="Accepted" className="value-accepted">
                            Accepted
                          </option>
                          <option value="Rejected" className="value-rejected">
                            Rejected
                          </option>
                        </select>
                      </td>
                      <td onClick={() => handleDelete(test._id)}>
                        <RiDeleteBin3Line />
                      </td>
                    </tr>
                  ))
                : "No Test-Drive request Found!"}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
