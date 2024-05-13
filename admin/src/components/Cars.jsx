import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useAdmin } from "../context/context";
import { Navigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [overlay, setOverlay] = useState(false);
  const [overlayData, setOverlayData] = useState({ company: "", model: "" });
  const overlayRef = useRef(null);
  const { isAuthenticated } = useAdmin();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data } = await axios.get("http://localhost:3601/api/v1/cars/", {
          withCredentials: true,
        });
        setCars(data.cars);
        console.log("cars", data.cars);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchCars();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  const responsive = {
    extraLarge: {
      breakpoint: { max: 3000, min: 1324 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
    large: {
      breakpoint: { max: 1324, min: 1005 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
    medium: {
      breakpoint: { max: 1005, min: 700 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
    small: {
      breakpoint: { max: 700, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  const handleOverlay = (company, model) => {
    setOverlayData({
      company,
      model,
    });
    setOverlay(true);
  };

  const overlayClose = (e) => {
    //  console.log("e", e, "playe.current", overlayRef.current);

    if (e.target === overlayRef.current) {
      setOverlay(false);
      setOverlayData({
        company: "",
        model: "",
      });
    }
  };
  return (
    <>
      <section className="page cars">
        <h1>CARS</h1>

        <div className="banner">
          {cars && cars.length > 0 ? (
            cars.map((element) => {
              return (
                <div className="card">
                  <div className="cars-carousal-outer-div">
                    <Carousel
                      responsive={responsive}
                      removeArrowOnDeviceType={["tablet", "mobile"]}
                    >
                      {element.carphotos.map((p, i) => (
                        <div
                          style={{ width: "100%" }}
                          key={i}
                          onClick={() =>
                            handleOverlay(element.company, element.model)
                          }
                        >
                          <img
                            style={{ width: "100%", borderRadius: 0 }}
                            src={p.url}
                            alt={`Car Photo ${i}`}
                          />
                        </div>
                      ))}
                    </Carousel>
                  </div>
                  <h4>{`Company: ${element.company.toUpperCase()}`}</h4>
                  <h4>{`Model: ${element.model}`}</h4>
                  <div className="details">
                    <p>
                      Car-Type: <span>{element.cartype.toUpperCase()}</span>
                    </p>
                    <p>
                      Engine-Type: <span>{element.enginetype}</span>
                    </p>
                    <p>
                      Milage: <span>{element.milage}</span>
                    </p>
                    <p>
                      Year Of Manufacturing: <span>{element.year}</span>
                    </p>
                    <p>
                      Boot Capacity: <span>{element.bootspace}</span>
                    </p>
                    <p>
                      Colors Available:
                      <br />
                      {element.colors.map((c, i) => (
                        <span key={i}>
                          {c}
                          <br />
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <h1>No Cars detail Found!</h1>
          )}
        </div>
      </section>

      {/* Overlay-Section */}

      {overlay && (
        <div className="overlay">
          {cars
            .filter((car) => car.model === overlayData.model)
            .map((car) => (
              <div key={car.model} ref={overlayRef} onClick={overlayClose}>
                <h2 className="overlay-heading">{`${car.company.toUpperCase()} ${
                  car.model
                }`}</h2>
                <div className="overlay-images">
                  {car.carphotos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo.url}
                      alt={`Car Photo ${index}`}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default Cars;
