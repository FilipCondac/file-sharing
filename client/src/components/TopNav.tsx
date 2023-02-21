import Link from "next/link";
import React from "react";
import authorizedStatus from "libs/authorizedStatus";
import logout from "libs/logout";
import Group from "./groups";
import axios from "axios";

const TopNav = (props: any) => {
  const [user, setUser] = React.useState(null);
  const [dropdown, setDropdown] = React.useState(false);
  const [groupsDropdown, setGroupsDropdown] = React.useState(false);
  const [createGroup, setCreateGroup] = React.useState(false);
  const [groupName, setGroupName] = React.useState("");

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

  const logoutAccount = async () => {
    try {
      await logout();
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  };

  const renderDropdown = () => {
    if (dropdown) {
      setDropdown(false);
    } else {
      setDropdown(true);
    }
  };

  const renderGroups = () => {
    if (!groupsDropdown) {
      setGroupsDropdown(true);
    } else {
      setGroupsDropdown(false);
    }
  };

  const renderAccountOptions = () => {
    props.setAccountOptions(true);
  };

  const renderCreateGroup = () => {
    if (createGroup) {
      setCreateGroup(false);
    } else {
      setCreateGroup(true);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch(
      "http://localhost:8000/api/files/createGroup",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupName }),
      }
    );

    const data = await response.json();
    const statusCode = data.status;

    if (statusCode === 200) {
      console.log(data.message);
    } else if (statusCode === 404) {
      console.log(data.message);
    } else {
      console.log(data.message);
    }
  };

  return (
    <div className="w-full h-16 p-0 text-gray-500">
      <div className="float-left">
        <h2 className="w-64 h-48 m-4 text-4xl font-bold ">
          <Link href={"/"}> SharePal </Link>
        </h2>
      </div>
      <div className="flex float-right m-3 mt-1 text-lg font-light text-gray-400">
        {user ? (
          <div className="flex flex-col float-right ">
            <div className="flex m-auto">
              <span className="flex mt-4 mr-5">
                <div className="flex flex-col">
                  <span
                    className="m-auto cursor-pointer"
                    onClick={renderGroups}
                  >
                    My Groups
                  </span>
                  {groupsDropdown && (
                    <div className="z-0 flex flex-col p-4 mt-3 mr-2 font-light border rounded-lg bg-gradient-to-r from-slate-800 to-slate-900 ">
                      <div className="flex flex-col float-right p-1 ml-20 text-base bg-gray-800 border rounded-lg">
                        <div className="flex" onClick={renderCreateGroup}>
                          <span className="mx-2">Create Group</span>
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
                              d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z"
                            />
                          </svg>
                        </div>
                        {createGroup && (
                          <div className="flex flex-col mx-2">
                            <form
                              className="flex flex-col"
                              onSubmit={handleSubmit}
                            >
                              <span className="mt-2 mb-2">Group Name:</span>
                              <input
                                className="mb-2 rounded-lg bg-slate-700"
                                onChange={(event) =>
                                  setGroupName(event.target.value)
                                }
                              />
                            </form>
                          </div>
                        )}
                      </div>

                      <div className="flex p-3 mt-5 bg-gray-800 border rounded-lg">
                        <span className="mr-3">Group Name: CSY3</span>
                        <span></span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 my-auto ml-auto"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </span>
              <div
                className="flex w-16 h-8 p-0 mt-3 ml-auto cursor-pointer"
                onClick={renderDropdown}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="p-1 text-black bg-gray-400 rounded-full "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className=""
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                  />
                </svg>
              </div>
            </div>
            {dropdown && (
              <div className="z-0 flex flex-col p-4 mt-3 mr-2 font-light border rounded-lg bg-gradient-to-r from-slate-800 to-slate-900">
                <div className="flex p-3 bg-gray-800 border rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="p-1 m-auto text-black bg-gray-400 rounded-full h-14 w-14 "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                  <div className="flex flex-col p-3 ml-3">
                    <span className="">{user.displayName}</span>
                    <span className="">{user.email}</span>
                    <div
                      className="flex px-2 mt-2 text-center border rounded-md cursor-pointer"
                      onClick={renderAccountOptions}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-auto"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="">Manage Account</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={logoutAccount}
                  className="mt-3 border rounded-xl"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href={"/login"}>
              <button className="m-5">Login </button>
            </Link>
            <Link href={"/register"}>
              <button className="m-5">Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default TopNav;
