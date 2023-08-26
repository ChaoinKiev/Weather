/** @format */

import React, { useEffect, useState } from "react";
import axios from "axios";
import { differenceInSeconds } from "date-fns";
import "./WeatherDisplay.css";
import { GoogleLogin } from "react-google-login";

const WeatherDisplay = ({
  selectedCity,
  getDayOfWeek,
  trips,
  selectedTripIndex,
}) => {
  const [WeatherDisplay, setWeatherDisplay] = useState(null);

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (trips.length > 0) {
      const selectedTrip = trips[selectedTripIndex];
      if (selectedTrip) {
        const startDate = new Date(selectedTrip.date.split(" - ")[0]);
        const currentTime = new Date();
        const timeDifferenceInSeconds = differenceInSeconds(
          startDate,
          currentTime
        );

        const days = Math.floor(timeDifferenceInSeconds / (60 * 60 * 24));
        const remainingSeconds = timeDifferenceInSeconds % (60 * 60 * 24);
        const hours = Math.floor(remainingSeconds / (60 * 60));
        const remainingMinutes = remainingSeconds % (60 * 60);
        const minutes = Math.floor(remainingMinutes / 60);
        const seconds = remainingMinutes % 60;

        setCountdown({ days, hours, minutes, seconds });
      }
    }
  }, [selectedTripIndex,trips]);

  useEffect(() => {
    const apiKey = "45XHHL2JKQC3XPVRRYAVH2AGS";
    const apiUrl =
      "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
    const fullUrl = `${apiUrl}${selectedCity}/today?unitGroup=metric&include=days&key=${apiKey}&contentType=json`;

    const fetchWeatherDisplay = async () => {
      try {
        const response = await axios.get(fullUrl);
        setWeatherDisplay(response.data?.days[0] || null);
      } catch (error) {
        console.error("Error fetching weather details:", error);
      }
    };

    fetchWeatherDisplay();
  }, [selectedCity, trips]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown.seconds > 0) {
          return {
            ...prevCountdown,
            seconds: prevCountdown.seconds - 1,
          };
        } else if (prevCountdown.minutes > 0) {
          return {
            ...prevCountdown,
            minutes: prevCountdown.minutes - 1,
            seconds: 59,
          };
        } else if (prevCountdown.hours > 0) {
          return {
            ...prevCountdown,
            hours: prevCountdown.hours - 1,
            minutes: 59,
            seconds: 59,
          };
        } else if (prevCountdown.days > 0) {
          return {
            ...prevCountdown,
            days: prevCountdown.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          };
        } else {
          clearInterval(interval); // Clear the interval when countdown is complete
          return prevCountdown;
        }
      });
    }, 1000);

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [countdown]);

  if (!WeatherDisplay) {
    return null;
  }

  const handleGoogleLoginSuccess = (response) => {
    // Handle successful login here
    console.log("Google login success:", response);
  };

  const handleGoogleLoginFailure = (error) => {
    // Handle login failure here
    console.error("Google login failed:", error);
  };
  return (
    <>
        <div className='login-icon'>
          <GoogleLogin
            clientId='YOUR_GOOGLE_CLIENT_ID'
            onSuccess={handleGoogleLoginSuccess}
            onFailure={handleGoogleLoginFailure}
            cookiePolicy='single_host_origin'
            isSignedIn={false}
          />
        </div>


      <h1 className='day'>{getDayOfWeek(WeatherDisplay.datetime)}</h1>
      <div className='weather-info'>
        <img
          src={
            process.env.PUBLIC_URL +
            "/weather-icons/" +
            `${WeatherDisplay.icon}` +
            ".png"
          }
          alt={WeatherDisplay.icon}
        />
        <h1>{WeatherDisplay.temp}˚</h1>
      </div>
      <h3 className='city'>{selectedCity}</h3>
      <div className='countdown-container'>
        <div className='countdown'>
          <p className='countdown-value'>{countdown.days}</p>
          <p>days</p>
        </div>
        <div className='countdown'>
          <p className='countdown-value'>{countdown.hours}</p>
          <p>hours</p>
        </div>
        <div className='countdown'>
          <p className='countdown-value'>{countdown.minutes}</p>
          <p>minutes</p>
        </div>
        <div className='countdown'>
          <p className='countdown-value'>{countdown.seconds}</p>
          <p>seconds</p>
        </div>
      </div>
    </>
  );
};

export default WeatherDisplay;
