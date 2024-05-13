import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAdmin } from "../context/context";
import { RiDeleteBin3Line } from "react-icons/ri";
import { Navigate } from "react-router-dom";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { isAuthenticated } = useAdmin();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3601/api/v1/message/getall",
          { withCredentials: true }
        );
        setMessages(data.message);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    fetchMessages();
  }, [messages]);

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:3601/api/v1/message/delete/${id}`,
        { withCredentials: true }
      );

      toast.success(data.message);
    } catch (error) {
      console.log(error.response.data.message);
      toast.success(error.response.data.message);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page messages">
      <h1>MESSAGE</h1>
      <div className="banner">
        {messages && messages.length > 0 ? (
          messages.map((element) => {
            return (
              <div className="card" key={element._id}>
                <div className="details">
                  <p>
                    First Name: <span>{element.firstname}</span>
                    <span onClick={() => handleDelete(element._id)}>
                      <RiDeleteBin3Line style={{ float: "right" }} />
                    </span>
                  </p>
                  <p>
                    Last Name: <span>{element.lastname}</span>
                  </p>
                  <p>
                    Email: <span>{element.email}</span>
                  </p>
                  <p>
                    Phone: <span>{element.phone}</span>
                  </p>
                  <p>
                    Message: <span>{element.message}</span>
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <h1>No Messages!</h1>
        )}
      </div>
    </section>
  );
};

export default Messages;
