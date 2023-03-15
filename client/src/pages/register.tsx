import React, { FormEvent, useState } from "react";
import TopNav from "@/components/TopNav";
import axios from "axios";

const register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // Register the user
      await axios.post(
        "api/files/register",
        { email, password, displayName },
        { headers: { "Content-Type": "application/json" } }
      );

      // Login the user
      const { data, status } = await axios.post(
        "api/files/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const user = data.user;

      if (status === 200) {
        window.location.href = "/";
        console.log(user);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col h-full m-auto bg-primarycolor-dark text-primarycolor-lightest font-Raleway ">
      <TopNav />

      <h1 className="m-auto mb-0 text-lg font-bold text-center text-primarycolor-lightest">
        Create an account with us
      </h1>
      <form
        onSubmit={onSubmit}
        className="m-auto mt-5 border p-20 rounded bg-gradient-to-r from-slate-800 to-slate-900 justify-centre text-center hover:shadow-[0_20px_60px_20px_rgba(235,206,235,0.2)]"
      >
        <div className="m-auto">
          <div>
            <input
              className="p-1 mb-3 border rounded-lg bg-slate-700"
              value={displayName}
              placeholder="Display Name"
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div>
            <input
              className="p-1 mb-3 border rounded-lg bg-slate-700"
              value={email}
              placeholder="E-Mail"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="">
            <input
              className="p-1 mb-3 border rounded-md bg-slate-700"
              value={password}
              placeholder="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="w-56 m-auto mt-2 text-sm text-center underline break-words">
            By registering I accept the terms and conditions and will not use
            the website for malicious intent
          </div>
          <div className="m-auto mt-5 text-center">
            <button
              className="inline-flex items-center px-4 py-2 font-bold text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
              onClick={onSubmit}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Register</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default register;
