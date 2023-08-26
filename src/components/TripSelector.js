/** @format */

import React, { useEffect, useState } from "react";
import "./TripSelector.css";
import Modal from "./Modal.js";
import WeatherDisplay from "./WeatherDisplay.js";
import axios from "axios";

const TripSelector = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [trips, setTrips] = useState([]);
  const [selectedTripIndex, setSelectedTripIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1); // Add 1 day to get tomorrow's date
  const formattedTomorrow = tomorrow.toISOString().split('T')[0]; 
  const sevenDaysLater = new Date(tomorrow);
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 6); // Add 6 days to get the end date
  const formattedSevenDaysLater = sevenDaysLater.toISOString().split('T')[0]; // Format end date to 'YYYY-MM-DD'  

  useEffect(() => {
    // Fetch weather data for the initial trip
    const fetchInitialWeatherData = async () => {
        
  const apiKey = "45XHHL2JKQC3XPVRRYAVH2AGS";
  const apiUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
  const fullUrl = `${apiUrl}Beijing/${formattedTomorrow}/${formattedSevenDaysLater}?unitGroup=metric&include=days&key=${apiKey}&contentType=json`;
  
  if (trips.length === 0) { // Check if trips array is empty before initializing it
    try {
      const response = await axios.get(fullUrl);
          const initialTrip = {
            city: "Beijing",
            date: `${formattedTomorrow} - ${formattedSevenDaysLater}`,
            image: `${process.env.PUBLIC_URL}/images/beijing.jpeg`,
            weatherForecast: response.data?.days || [],
          };
          setTrips([initialTrip]);
        } catch (error) {
          console.error("Error fetching initial weather data:", error);
        }
      }
    }; 
    fetchInitialWeatherData();
  }, [formattedTomorrow]); 
  
  

  useEffect(() => {
    if (trips.length > 0) {
      setSelectedCity(trips[selectedTripIndex].city);
    }
  }, [selectedTripIndex, trips]);

  const getDayOfWeek = (dateString) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    return daysOfWeek[dayOfWeek];
  };

  const addTrip = async (selectedCity, startDate, endDate) => {
    // Check if the input is not null or ""
    if (selectedCity && startDate && endDate) {
      const apiKey = "45XHHL2JKQC3XPVRRYAVH2AGS";
      const apiUrl =
        "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
      const fullUrl = `${apiUrl}${selectedCity}/${startDate}/${endDate}?unitGroup=metric&include=days&key=${apiKey}&contentType=json`;
      setSelectedTripIndex(trips.length - 1); // Set to the index of the newly added trip

      try {
        // Fetch weather data for the new trip
        const response = await axios.get(fullUrl);
        // const weatherData = response.data?.days || [];

        // Create a new trip object with the input values and weather data
        const newTrip = {
          city: selectedCity,
          date: `${startDate} - ${endDate}`,
          image:
            process.env.PUBLIC_URL +
            "/images/" +
            selectedCity.toLowerCase() +
            ".jpeg",
          weatherForecast: response.data?.days || [], // Store weather data
        };
        setTrips((prevTrips) => [...prevTrips, newTrip]);
        setSelectedCity(selectedCity);
        setSelectedTripIndex(trips.length);
        // Use setTimeout to ensure the state is updated before running the next code
        setTimeout(() => {
          setSelectedTripIndex(trips.length);
        }, 0);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    }
  };

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };
  const handleNext = () => {
    if (selectedTripIndex < trips.length - 1) {
      setSelectedTripIndex((prevIndex) => prevIndex + 1);
      setSearchQuery("");
    }
  };
  
  const handlePrevious = () => {
    if (selectedTripIndex > 0) {
      setSelectedTripIndex((prevIndex) => prevIndex - 1);
      setSearchQuery("");
    }
  };
  
  const filteredTrips = trips.filter((trip) =>
    trip.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className='all'>
        <div className='left-side'>
          <div className='top-left'>
            <h1>
              Weather <b>Forecast</b>
            </h1>
          </div>
          <div className='search-box'>
            <input
              type='text'
              placeholder='Search your trip'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className='trip-list'>
            {!showModal && (
              <div className='arrow-button-container left'>
                <button
                  className={`arrow-button ${
                    selectedTripIndex === 0 || filteredTrips.length === 0
                      ? "disabled"
                      : ""
                  }`}
                  onClick={handlePrevious}
                  disabled={
                    selectedTripIndex === 0 || filteredTrips.length === 0
                  }>
                  &#9664;
                </button>
              </div>
            )}
            {filteredTrips.map((trip, index) => (
              <div
                className={`trip-card ${
                  selectedTripIndex === index ? "selected-trip-card" : ""
                }`}
                key={index}>
                <img src={trip.image} alt={trip.city} />
                <div className='destination'>{trip.city}</div>
                <div className='date'>{trip.date}</div>
              </div>
            ))}
            <div className='trip-card add-card' onClick={handleModalOpen}>
              <div className='add-icon'>+</div>

              <div className='destination'>Add Trip</div>
            </div>

            {!showModal && (
              <div className='arrow-button-container right'>
                <button
                  className={`arrow-button ${
                    selectedTripIndex === filteredTrips.length - 1
                      ? "disabled"
                      : ""
                  }`}
                  onClick={handleNext}
                  disabled={selectedTripIndex === filteredTrips.length - 1}>
                  &#9654;
                </button>
              </div>
            )}
            <Modal
              isOpen={showModal}
              onClose={handleModalClose}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              addTrip={addTrip}
            />
          </div>
          <h3>Week</h3>



          <div className='weather-forecast'>
            {trips[selectedTripIndex]?.weatherForecast?.map((day, index) => (
              <div className='weather-card' key={index}>
                <div className='day'>{getDayOfWeek(day.datetime)}</div>
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/weather-icons/" +
                    `${day.icon}` +
                    ".png"
                  }
                  alt={day.icon}
                />

                <div className='temperature'>{`${day.tempmax}˚/${day.tempmin}˚`}</div>
              </div>
            ))}
          </div>
    
        </div>
        <div className='weather-details-container'>
          <WeatherDisplay
            selectedCity={selectedCity}
            getDayOfWeek={getDayOfWeek}
            trips={trips}
            selectedTripIndex={selectedTripIndex}
          />
        </div>
      </div>
    </>
  );
};

export default TripSelector;
