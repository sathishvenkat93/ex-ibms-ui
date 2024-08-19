import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const hardcodedEmail = 'maheshkumar@gmail.com';
    const hardcodedPassword = 'password123';

    if (email === hardcodedEmail && password === hardcodedPassword) {
      navigate('/dashboard');
    } else {
      alert('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-cover" style={{ backgroundImage: "url('../src/assets/images/background.jpg')" }}>
      <div className="max-w-md w-full space-y-8 p-8 bg-white bg-opacity-80 rounded-md shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Login</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
    Email address
  </label>
  <input
    id="email"
    name="email"
    type="email"
    autoComplete="email"
    required
    className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input id="password" name="password" type="password" autoComplete="current-password" required className="text-black mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Log in
            </button>
          </div>
        </form>
        <div className="text-center text-sm text-black">
          <span>New Here? </span>
          <Link to="register" className="text-indigo-600 hover:text-indigo-800">Create an Account</Link>
        </div>
      </div>
    </div>
  );
}
