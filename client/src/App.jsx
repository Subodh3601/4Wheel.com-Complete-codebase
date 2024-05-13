import { useContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TestDrive from "./pages/TestDrive";
import AboutUs from "./pages/AboutUs";
import Register from "./pages/Register";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useClient } from "./context/context";
import Login from "./pages/Login";
import CarDetail from "./pages/CarDetail";
import UserProfile from "./pages/UserProfile";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useClient();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3601/api/v1/user/rider/me",
          {
            withCredentials: true,
          }
        );

        // console.log("response.data.user from client side", response.data.user);
        setUser(response.data.user);
      } catch (error) {
        setUser({});
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/cardetail" element={<CarDetail />} />
          <Route path="/" element={<Home />} />
          <Route path="/testDrive" element={<TestDrive />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/userprofile" element={<UserProfile />} />
        </Routes>
        <Footer />
        <ToastContainer position="top-center" />
      </Router>
    </>
  );
};

export default App;
