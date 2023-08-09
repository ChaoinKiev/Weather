/** @format */

// src/components/Modal.js

import React, { useState } from "react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Modal.css";

const cities = [
  "Kyiv",
  "Paris",
  "Venice",
  "Barcelona",
  "Beijing",
  "Prague",
  "Cape Town",
  "Vienna",
  "Budapest",
  "Vancouver",
]; // Replace this with your list of cities

const Modal = ({
  isOpen,
  onClose,
  selectedCity,
  setSelectedCity,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  addTrip,
}) => {
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isStartDateDropdownOpen, setIsStartDateDropdownOpen] = useState(false);
  const [isEndDateDropdownOpen, setIsEndDateDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const handleCityChange = (city) => {
    setSelectedCity(city);
    setIsCityDropdownOpen(false);
  };
  const handleStartDateChange = (date) => {
    // setStartDate(format(date, "yyyy-MM-dd"));
    setStartDate(date);
    setIsStartDateDropdownOpen(false);
    setIsEndDateDropdownOpen(true); // Enable the end date picker after selecting the start date
  };

  const handleCancel = () => {
    // Reset the state and close the modal
    setSelectedCity("");
    setStartDate(null);
    setEndDate(null);
    onClose();
  };
  const handleSave = () => {
    addTrip(
      selectedCity,
      format(startDate, "yyyy-MM-dd"),
      format(endDate, "yyyy-MM-dd")
    );
    setSelectedCity("");
    setStartDate(null);
    setEndDate(null);
    onClose();
  };

  return (
    <>

      <div className='modal-overlay'>
        <div className='modal'>
          <div className='modal-header'>
            <h2>Create Trip</h2>
            <button className='close-btn' onClick={handleCancel}>
              &times;
            </button>
          </div>
          <hr className='divider' />
          <div className='modal-content'>
            <form>
              <div className='form-field'>
                <label htmlFor='city'>
                  <span className='required'>*</span>City
                </label>
                <div className='input-with-dropdown'>
                  <input
                    type='text'
                    id='city'
                    value={isCityDropdownOpen ? "" : selectedCity}
                    placeholder='Please select a city'
                    onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                    readOnly
                  />
                  <div
                    className={`dropdown-icon ${
                      isCityDropdownOpen ? "open" : ""
                    }`}
                    onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}>
                    ⌵
                  </div>
                  {isCityDropdownOpen && (
                    <div className='dropdown-list'>
                      {cities.map((city) => (
                        <div
                          key={city}
                          className='dropdown-item'
                          onClick={() => handleCityChange(city)}>
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className='form-field'>
                <label htmlFor='start-date'>
                  <span className='required'>*</span>Start Date
                </label>
                <div className='input-with-dropdown'>
                  <input
                    type='text'
                    id='start-date'
                    value={startDate}
                    placeholder='Please select a start date'
                    onClick={() =>
                      setIsStartDateDropdownOpen(!isStartDateDropdownOpen)
                    }
                  />
                  <div
                    className={`dropdown-icon ${
                      isStartDateDropdownOpen ? "open" : ""
                    }`}
                    onClick={() =>
                      setIsStartDateDropdownOpen(!isStartDateDropdownOpen)
                    }>
                    🗓️
                  </div>
                  {isStartDateDropdownOpen && (
                    <div className='dropdown-list'>
                      <DatePicker
                        selected={startDate}
                        onChange={handleStartDateChange}
                        minDate={
                          new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
                        } // Set minDate to tomorrow
                        maxDate={
                          new Date(
                            new Date().getTime() + 16 * 24 * 60 * 60 * 1000
                          )
                        }
                        inline
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className='form-field'>
                <label htmlFor='end-date'>
                  <span className='required'>*</span>End Date
                </label>
                <div className='input-with-dropdown'>
                  <input
                    type='text'
                    id='end-date'
                    value={endDate}
                    placeholder='Please select an end date'
                    onClick={() =>
                      isEndDateDropdownOpen &&
                      setIsEndDateDropdownOpen(!isEndDateDropdownOpen)
                    }
                    readOnly={!isStartDateDropdownOpen}
                  />
                  <div
                    className={`dropdown-icon ${
                      isEndDateDropdownOpen ? "open" : ""
                    }`}
                    onClick={() =>
                      setIsEndDateDropdownOpen(!isEndDateDropdownOpen)
                    }>
                    🗓️
                  </div>
                  {isEndDateDropdownOpen && (
                    <div className='dropdown-list'>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => {
                          setEndDate(date);
                          setIsEndDateDropdownOpen(false);
                        }}
                        minDate={startDate} // Allow selection only from start date onwards
                        maxDate={
                          new Date(
                            new Date().getTime() + 16 * 24 * 60 * 60 * 1000
                          )
                        }
                        inline
                      />
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
          <hr className='divider' />
          <div className='modal-footer'>
            <button className='cancel-btn' onClick={handleCancel}>
              Cancel
            </button>
            <button className='save-btn' type='submit' onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
