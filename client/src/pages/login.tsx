import React, { FormEvent, useState } from "react";
import TopNav from "@/components/TopNav";
import axios from "axios";

const register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountError, setAccountError] = useState("");
  const [emailForm, setEmailForm] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const { data, status } = await axios.post(
        "api/files/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const user = data.user;

      if (status === 200) {
        window.location.href = "/";
        console.log(user);
      } else if (status === 404) {
        setAccountError("Invalid credentials");
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const signInWithGoogle = async () => {
  //   const response = await fetch(
  //     "http://localhost:8000/api/files/signInWithGoogle",
  //     {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" },
  //     }
  //   );
  //   console.log(response);
  //   // const data = await response.json();
  //   // const user = data.user;
  //   // const statusCode = data.status;
  // };

  const loadEmailForm = () => {
    setEmailForm(true);
  };

  const resetPassword = async () => {
    try {
      const { data, status } = await axios.post(
        "api/files/resetPassword",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (status === 200) {
        window.location.href = "/";
        console.log(data.message);
      } else if (status === 404) {
        setAccountError("Invalid credentials");
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
        Login to your existing account
      </h1>
      <form
        onSubmit={onSubmit}
        className="m-auto mt-5 border p-20 rounded bg-gradient-to-r from-slate-800 to-slate-900 justify-centre text-center hover:shadow-[0_20px_60px_20px_rgba(235,206,235,0.1)]"
      >
        <div className="m-auto ">
          {accountError !== "" && (
            <div className="text-red-400 ">{accountError}</div>
          )}
          <div>
            <input
              className="p-1 mb-3 border rounded-lg bg-slate-700"
              value={email}
              placeholder="E-Mail"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {!emailForm ? (
            <div>
              <div className="">
                <input
                  className="p-1 mb-3 border rounded-md bg-slate-700"
                  value={password}
                  placeholder="Password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
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
                  <span>Login</span>
                </button>
              </div>
              <div className="mt-5">
                <span className="mt-6 cursor-pointer" onClick={loadEmailForm}>
                  Forgot Password
                </span>
              </div>
            </div>
          ) : (
            <div className="m-auto mt-5 text-center">
              <button
                className="inline-flex items-center px-4 py-2 font-bold text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
                onClick={resetPassword}
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
                <span>Send Email</span>
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default register;
