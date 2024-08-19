import { colors } from "@mui/material";
import React, { useState } from "react";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");

  
  const states = ["Tamil Nadu", "Delhi", "Kerala"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-cover" style={{ backgroundImage: "url('../src/assets/images/background.jpg')" }}>
      <div className="max-w-md w-full space-y-8 p-8 bg-white bg-opacity-80 rounded-md shadow-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Create an Account</h2>
        <form className="mt-8 space-y-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={firstName}
              
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            />
          </div>
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
              Business Name
            </label>
            <input
              id="businessName"
              name="businessName"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State
            </label>
            <select
              id="state"
              name="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            >
              <option value="">Select State</option>
              {states.map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="text-black w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
