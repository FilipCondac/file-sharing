import React, { FormEvent, useState } from "react";
import TopNav from "@/components/TopNav";

const register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/api/files/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    console.log(response.json());
  };

  return (
    <div className="flex flex-col h-full dark [--scroll-mt:9.875rem] lg:[--scroll-mt:6.3125rem] dark:bg-slate-900 text-sky-400 font-Raleway m-auto ">
      <TopNav />

      <h1 className="m-auto mb-0 text-lg font-bold text-center text-gray-400">
        Login to your existing account
      </h1>
      <form
        onSubmit={onSubmit}
        className="m-auto mt-5 shadow-[0_20px_60px_20px_rgba(135,206,235,0.1)] p-20 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 justify-centre text-center hover:shadow-[0_20px_60px_20px_rgba(235,206,235,0.2)]"
      >
        <div className="m-auto">
          <div>
            <input
              className="p-1 mb-3 rounded-lg bg-slate-700"
              value={email}
              placeholder="E-Mail"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="">
            <input
              className="p-1 mb-3 rounded-md bg-slate-700"
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
        </div>
      </form>
    </div>
  );
};

export default register;
