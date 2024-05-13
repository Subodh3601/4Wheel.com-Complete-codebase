import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAdmin } from "../context/context";

const AddNewCar = () => {
  const navigateTo = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAdmin();

  const [model, setModel] = useState("");
  const [company, setCompany] = useState("");
  const [year, setYear] = useState("");
  const [milage, setMilage] = useState("");
  const [bootspace, setBootspace] = useState("");
  const [seatingcapacity, setSeatingcapacity] = useState("");
  const [enginetype, setEnginetype] = useState("");
  const [colors, setColors] = useState([]);
  const [carphotos, setCarphotos] = useState([]);
  const [carPhotosPreview, setCarPhotosPreview] = useState([]);
  const [carType, setCarType] = useState("");

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

  const colorArray = [
    "White",
    "Black",
    "Red",
    "Golden",
    "Golden-black",
    "Orange",
    "Golden-Dark-Blue",
    "Dark-Silver",
    "MultiColor",
  ];
  const carTypeArray = [
    "sedan",
    "hatchback",
    "sports",
    "convertible",
    "coupe",
    "micro",
    "suv",
    "antique",
    "ev",
    "musclecar",
  ];

  const handlePhotoPreview = (e) => {
    const files = e.target.files;
    const newPhotosPreview = [];
    const newPhotos = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        newPhotosPreview.push(reader.result);
        setCarPhotosPreview([...newPhotosPreview]);
      };

      newPhotos.push(file);
    }

    setCarphotos([...carphotos, ...newPhotos]);
  };

  const handleAddNewCar = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("model", model);
      formData.append("company", company);
      formData.append("year", year);
      formData.append("milage", milage);
      formData.append("cartype", carType);
      formData.append("bootspace", bootspace);
      formData.append("seatingcapacity", seatingcapacity);
      formData.append("enginetype", enginetype);
      formData.append("colors", JSON.stringify(colors)); // Store colors as a JSON string

      // Append all car photos
      carphotos.forEach((photo) => {
        formData.append("carphotos", photo);
      });

      const response = await axios.post(
        "http://localhost:3601/api/v1/cars/addnew",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // console.log("response", response.data.message);
      toast.success(response.data.message);
      setModel("");
      setCompany("");
      setYear("");
      setMilage("");
      setCarType("");
      setBootspace("");
      setSeatingcapacity("");
      setEnginetype("");
      setColors([]); // Clear selected colors
      setCarphotos([]);
      setCarPhotosPreview([]);

      // Redirect to homepage or any other route after successful submission
      navigateTo("/cars");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const currentYear = new Date().getFullYear();
  const startYear = 2010;
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => startYear + index
  );
  // console.log("years", years)

  const max = 10;
  const min = 1;
  const seats = Array.from(
    { length: max - min + 1 },
    (_, index) => min + index
  );

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page">
      <section className="container add-car-form">
        <h1 className="form-title">ADD A NEW CAR</h1>
        <form onSubmit={handleAddNewCar} encType="multipart/form-data">
          <div className="first-wrapper">
            <div className="first-div">
              <div className="second-div">
                {carPhotosPreview.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`uploaded car image ${index}`}
                  />
                ))}
              </div>
              <input type="file" onChange={handlePhotoPreview} multiple />
            </div>
            <div>
              <input
                type="text"
                placeholder="Model Name"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
              />

              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              >
                <option value="">Select Company</option>
                {companyArray.map((name, index) => (
                  <option value={name} key={index}>
                    {name}
                  </option>
                ))}
              </select>

              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              >
                <option value={""}>Select Manufaturing year</option>
                {years.map((y, index) => (
                  <option value={y} key={index}>
                    {y}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Mileage in kmpl"
                value={milage}
                onChange={(e) => setMilage(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Bootspace in liters"
                value={bootspace}
                onChange={(e) => setBootspace(e.target.value)}
                required
              />
              <select
                value={seatingcapacity}
                onChange={(e) => setSeatingcapacity(e.target.value)}
                required
              >
                <option value={""}>Select the seatingcapacity</option>
                {seats.map((y, index) => (
                  <option value={y} key={index}>
                    {y}
                  </option>
                ))}
              </select>
              <select
                value={carType}
                onChange={(e) => setCarType(e.target.value)}
                required
              >
                <option value={""}>Select the CarType</option>
                {carTypeArray.map((y, index) => (
                  <option value={y} key={index}>
                    {y}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Engine Type"
                value={enginetype}
                onChange={(e) => setEnginetype(e.target.value)}
                required
              />
              <select
                multiple
                value={colors}
                onChange={(e) => {
                  const selectedColors = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  setColors(selectedColors);
                }}
                required
              >
                {colorArray.map((col, index) => (
                  <option value={col} key={index}>
                    {col}
                  </option>
                ))}
              </select>

              <button type="submit">Add New Car</button>
            </div>
          </div>
        </form>
      </section>
    </section>
  );
};

export default AddNewCar;
