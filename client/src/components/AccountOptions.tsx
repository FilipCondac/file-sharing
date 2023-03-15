import React from "react";
import authorizedStatus from "libs/authorizedStatus";
import axios from "axios";

const AccountOptions = () => {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const fetchAuthorizedStatus = async () => {
      try {
        const data = await authorizedStatus();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAuthorizedStatus();
  }, []);

  const [displayName, setDisplayName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [accountError, setAccountError] = React.useState("");

  const updateAccount = async () => {
    try {
      const { status } = await axios.post(
        "api/files/updateAccount",
        { displayName, email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (status === 200) {
        window.location.href = "/";
      } else {
        setAccountError("Invalid credentials");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteAccount = async () => {
    try {
      const confirmed = window.confirm(
        "ARE YOU SURE YOU WANT TO DELETE ACCOUNT? THIS CANNOT BE UNDONE."
      );
      if (confirmed) {
        const { status } = await axios.post(
          "api/files/deleteAccount",
          { password },
          { headers: { "Content-Type": "application/json" } }
        );

        if (status === 200) {
          window.location.href = "/";
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col p-10 mb-32 border w-96 text-slate-400 rounded-2xl border-slate-600 bg-gradient-to-r from-slate-800 to-slate-900 font-Raleway">
      <h1 className="m-auto mb-5 text-2xl font-semibold">Account Options</h1>
      <div className="flex flex-col">
        <form className="">
          <div className="flex flex-col mb-5">
            <label className="mr-10 text-lg">Display Name:</label>
            <input
              type="text"
              className="p-1 px-2 rounded-lg bg-slate-700"
              placeholder={user?.displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            ></input>
          </div>
          <div className="flex flex-col mb-5">
            <label className="mr-10 text-lg">E-Mail:</label>
            <input
              type="text"
              className="p-1 px-2 rounded-lg bg-slate-700"
              placeholder={user?.email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className="flex flex-col mb-5">
            <label className="mr-10 text-lg">Password:</label>
            <input
              type="password"
              className="p-1 px-2 rounded-lg bg-slate-700"
              placeholder="****************"
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <div
            className="flex justify-center mt-2 text-center border rounded-md cursor-pointer"
            onClick={updateAccount}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            <span className="">Update</span>
          </div>
          {accountError !== "" && (
            <div className="flex justify-center mt-2 text-center text-red-600 border rounded-md cursor-pointer">
              <span className="">{accountError}</span>
            </div>
          )}
          <div
            className="flex justify-center p-1 mt-10 text-center bg-red-600 border rounded-md cursor-pointer"
            onClick={deleteAccount}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
            <span className="font-bold">DELETE ACCOUNT</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountOptions;
