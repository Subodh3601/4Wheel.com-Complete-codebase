import React, { useContext, useEffect, useRef, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useClient } from "../context/context";
import ProfileMenu from "../components/ProfileMenu";

const CarDetail = () => {
  const [cars, setCars] = useState([]);
  const [carType, setCarType] = useState("");
  const [url, setUrl] = useState("/detail-page.png");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [overlay, setOverlay] = useState(false);
  const [overlayData, setOverlayData] = useState("");
  const overlayRef = useRef(null);

  const { profileMenu } = useClient();

  const carTypeArray = [
    {
      name: "sedan",
      imageUrl: "/departments/sedan.webp",
    },
    {
      name: "hatchBack",
      imageUrl: "/departments/hatchback.jpeg",
    },
    {
      name: "sports",
      imageUrl: "/departments/sports.webp",
    },
    {
      name: "convertible",
      imageUrl: "/departments/convertible.webp",
    },
    {
      name: "coupe",
      imageUrl: "/departments/coupe.jpg",
    },
    {
      name: "micro",
      imageUrl: "/departments/micro.webp",
    },
    {
      name: "suv",
      imageUrl: "/departments/suv.jpeg",
    },
    {
      name: "antique",
      imageUrl: "/departments/antique.jpg",
    },
    {
      name: "ev",
      imageUrl: "/departments/ev.jpeg",
    },
    {
      name: "musclecar",
      imageUrl: "/departments/muscle.webp",
    },
  ];

  const responsive = {
    extraLarge: {
      breakpoint: { max: 3000, min: 1324 },
      items: 4,
      slidesToSlide: 1, // optional, default to 1.
    },
    large: {
      breakpoint: { max: 1324, min: 1005 },
      items: 3,
      slidesToSlide: 1, // optional, default to 1.
    },
    medium: {
      breakpoint: { max: 1005, min: 700 },
      items: 2,
      slidesToSlide: 1, // optional, default to 1.
    },
    small: {
      breakpoint: { max: 700, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

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

  const handleselect = (name, url) => {
    setCarType(name.toUpperCase());
    setUrl(url);
    setSelectedCompany("");
    setSelectedModel("");
  };

  const handleOverlay = (model) => {
    setOverlayData(model);
    setOverlay(true);
  };

  const overlayClose = (e) => {
    console.log("e", e, "playe.current", overlayRef.current);

    if (e.target === overlayRef.current) {
      setOverlay(false);
      setOverlayData("");
    }
  };

  return (
    <>
      <div className="container departments">
        <Carousel
          responsive={responsive}
          removeArrowOnDeviceType={[
            // "superLargeDesktop",
            // "desktop",
            "tablet",
            "mobile",
          ]}
        >
          {carTypeArray.map((depart, index) => {
            return (
              <div
                key={index}
                className="card "
                style={{ marginTop: "5rem" }}
                onClick={() => handleselect(depart.name, depart.imageUrl)}
              >
                <div className="depart-name">{depart.name}</div>
                <img src={depart.imageUrl} alt="Department" />
              </div>
            );
          })}
        </Carousel>
      </div>

      <div className="container">
        <div className="detail-section">
          <img src={url} alt={carType} />
          <div className="detail-title">
            <h1>{carType}</h1>
          </div>
          <div className="detail-sidebar">
            <div className="select-div">
              <select
                className="select-company"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                <option value={""}>Choose the Company</option>
                {cars
                  .filter((car) => car.cartype === carType.toLowerCase())
                  .map((c, i) => (
                    <>
                      <option value={c.company}>{c.company}</option>
                    </>
                  ))}
              </select>
            </div>

            <div className="select-div">
              <select
                className="select-company"
                disabled={!selectedCompany}
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                <option value={""}>Choose the Model</option>
                {cars
                  .filter((car) => car.company === selectedCompany)
                  .map((c, i) => (
                    <>
                      <option value={c.model}>{c.model}</option>
                    </>
                  ))}
              </select>
            </div>
          </div>
          <div className="detail-display">
            {cars
              .filter((car) => car.model === selectedModel)
              .map((c, i) => (
                <>
                  <div
                    className="model-img-div"
                    onClick={() => handleOverlay(selectedModel)}
                  >
                    {c.carphotos.map((p, i) => (
                      <img src={p.url} />
                    ))}
                  </div>
                  <div className="detail-car">
                    <p style={{ fontSize: "2rem" }}>
                      <b>
                        Car-Company:{" "}
                        <span style={{ fontSize: "2rem" }}>
                          {c.company.toUpperCase()}
                        </span>
                      </b>
                    </p>
                    <p style={{ fontSize: "1.5rem" }}>
                      <b>
                        Car-Model:{" "}
                        <span style={{ fontSize: "1.5rem" }}>{c.model}</span>
                      </b>
                    </p>
                    <div
                      style={{
                        textAlign: "left",
                        width: "80%",
                        marginInline: "auto",
                        fontSize: "1.2rem",
                        fontWeight: "500",
                      }}
                    >
                      <p>
                        Engine-Type: <span>{c.enginetype}</span>
                      </p>
                      <p>
                        Milage: <span>{c.milage}</span>
                      </p>
                      <p>
                        Seating Capacity: <span>{c.seatingcapacity}</span>
                      </p>
                      <p>
                        Year Of Manufacturing: <span>{c.year}</span>
                      </p>
                      <p>
                        Boot Capacity: <span>{c.bootspace}</span>
                      </p>
                      <p>
                        Colors Available:
                        <br />
                        {c.colors.map((c, i) => (
                          <span key={i}>
                            {c}
                            <br />
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                </>
              ))}
          </div>
        </div>
      </div>

      {/* Overlay-Section */}

      {overlay && (
        <div className="overlay">
          {cars
            .filter((car) => car.model === overlayData)
            .map((car) => (
              <div key={car.model} ref={overlayRef} onClick={overlayClose}>
                <h2 className="overlay-heading">
                  {`${car.company.toUpperCase()} ${car.model}`}
                </h2>
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

      {profileMenu && <ProfileMenu />}
    </>
  );
};

export default CarDetail;
