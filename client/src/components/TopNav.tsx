import Link from "next/link";
import React, { useEffect } from "react";
import authorizedStatus from "libs/authorizedStatus";
import logout from "libs/logout";
import { useRouter } from "next/router";
import axios from "axios";

const TopNav = (props: any) => {
  const router = useRouter();

  //Dropdown menu
  const [user, setUser] = React.useState(null);
  const [dropdown, setDropdown] = React.useState(false);

  //Groups create
  const [groupsDropdown, setGroupsDropdown] = React.useState(false);
  const [createGroup, setCreateGroup] = React.useState(false);
  const [groupName, setGroupName] = React.useState("");

  //Group list
  const [groupList, setGroupList] = React.useState([]);

  //Join Group
  const [joinGroup, setJoinGroup] = React.useState(false);
  const [joinPhrase, setJoinPhrase] = React.useState("");
  const [groupWordPhrase, setGroupWordPhrase] = React.useState("");
  const [joinStatus, setJoinStatus] = React.useState("");

  useEffect(() => {
    getGroups();
  }, [joinStatus, groupName, groupWordPhrase]);

  //Get User Status
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

  //Logout
  const logoutAccount = async () => {
    try {
      await logout();
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  };

  //Render Dropdown Menu for groups
  const renderDropdown = () => {
    if (dropdown) {
      setDropdown(false);
    } else {
      setDropdown(true);
      if (groupsDropdown) {
        setGroupsDropdown(false);
      }
    }
  };

  //Render already joined groups
  const renderGroups = async () => {
    if (!groupsDropdown) {
      setGroupsDropdown(true);
      await getGroups();
      if (dropdown) {
        setDropdown(false);
      }
    } else {
      setGroupsDropdown(false);
    }
  };

  //Render Account Options Form
  const renderAccountOptions = () => {
    props.setAccountOptions(true);
  };

  //Render Create Group Form
  const renderCreateGroup = () => {
    if (createGroup) {
      setCreateGroup(false);
    } else {
      setCreateGroup(true);
      if (joinGroup) {
        setJoinGroup(false);
      }
    }
  };

  //Render Join Group Form
  const renderJoinGroup = () => {
    if (joinGroup) {
      setJoinGroup(false);
    } else {
      setJoinGroup(true);
      if (createGroup) {
        setCreateGroup(false);
      }
    }
  };

  //Create Group
  const handleSubmitCreate = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const { data, status } = await axios.post(
        "api/files/createGroup",
        { groupName },
        { headers: { "Content-Type": "application/json" } }
      );

      if (status === 200) {
        setGroupWordPhrase(data.phrase);
      } else if (status === 404) {
        console.log(data.message);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Join Group
  const handleSubmitJoin = async (event: React.FormEvent) => {
    event.preventDefault();
    const phrase = joinPhrase.toLowerCase();

    try {
      const { data, status } = await axios.post(
        "api/files/joinGroup",
        { phrase },
        { headers: { "Content-Type": "application/json" } }
      );

      if (status === 200) {
        setJoinStatus("Joined Group Successfully");
      } else if (status === 404) {
        console.log(data.message);
        setJoinStatus("Group Not Found");
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Display groups
  const getGroups = async () => {
    try {
      const { data, status } = await axios.get("api/files/getUserGroups", {
        headers: { "Content-Type": "application/json" },
      });

      const groups = data.groups;

      if (status === 200) {
        setGroupList(groups);
      } else if (status === 404) {
        console.log(data.status + data.message);
      } else {
        console.log(data.status + data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRedirect = () => {
    if (window.location.href === "/") {
      window.location.reload();
    } else {
      window.location.href = "/";
    }
  };

  const handleGroupRedirect = (group: any) => {
    router.push({
      pathname: "/group",
      query: {
        groupID: group._id,
      },
    });
  };

  return (
    <div className="z-10 w-full h-16 p-0 mb-10 text-gray-500">
      <div className="float-left">
        <h2 className="w-64 h-48 m-4 text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-sky-400">
          <span onClick={handleRedirect} className="cursor-pointer">
            SharePal
          </span>
        </h2>
      </div>
      <div className="flex float-right m-3 mt-1 text-lg font-light text-primarycolor-lightest">
        {/* Check for user before rendering */}
        {user ? (
          <div className="flex flex-col float-right ">
            <div className="flex ml-auto">
              <span className="flex mt-4 mr-5">
                <div className="flex flex-col">
                  <span
                    className="float-right ml-auto cursor-pointer"
                    onClick={renderGroups}
                  >
                    My Groups
                  </span>

                  {/* My group dropdown menu */}
                  {groupsDropdown && (
                    <div className="z-0 flex flex-col p-4 mt-3 mr-2 font-light border rounded-lg bg-gradient-to-r from-slate-800 to-slate-900 ">
                      <div className="flex flex-col ">
                        <div className="flex">
                          {/* Join group button */}
                          <div
                            className="flex float-left p-1 text-base bg-gray-800 border rounded cursor-pointer"
                            onClick={renderCreateGroup}
                          >
                            <span className="mx-2">Join Group</span>
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
                                d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                              />
                            </svg>
                          </div>
                          {/* Create group button */}
                          <div
                            className="flex float-right p-1 ml-2 text-base bg-gray-800 border rounded cursor-pointer"
                            onClick={renderJoinGroup}
                          >
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
                        </div>
                        {/* Render and un-render the other join/create button */}
                        {createGroup && !joinGroup && (
                          <div className="flex flex-col mx-2">
                            <h2 className="m-auto mt-2 font-bold">
                              Join Group
                            </h2>
                            <form
                              className="flex flex-col"
                              onSubmit={handleSubmitJoin}
                            >
                              <span className="mb-2 ">
                                Enter three word phrase:
                              </span>
                              <input
                                className="mb-2 rounded-lg bg-slate-700"
                                onChange={(event) =>
                                  setJoinPhrase(event.target.value)
                                }
                              />
                            </form>
                            {(joinStatus == "Joined Group Successfully" && (
                              <div className="m-auto">
                                <span className="text-green-500">
                                  {joinStatus}
                                </span>
                              </div>
                            )) ||
                              (joinStatus == "Group Not Found" && (
                                <div className="m-auto">
                                  <span className="text-red-500">
                                    {joinStatus}
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}
                        {!createGroup && joinGroup && (
                          <div className="flex flex-col mx-2">
                            <h2 className="m-auto mt-2 font-bold">
                              Create Group
                            </h2>
                            <form
                              className="flex flex-col"
                              onSubmit={handleSubmitCreate}
                            >
                              <span className="mt-2 mb-2">Group Name:</span>
                              <input
                                className="mb-2 rounded-lg bg-slate-700"
                                onChange={(event) =>
                                  setGroupName(event.target.value)
                                }
                              />
                              {groupWordPhrase !== "" && (
                                <div className="flex flex-col m-auto">
                                  <span className="mt-3">
                                    Your three word phrase:{" "}
                                  </span>
                                  <span className="text-sky-400">
                                    {groupWordPhrase.toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </form>
                          </div>
                        )}
                      </div>
                      {/* List groups user is part of */}
                      <h2 className="m-auto mt-3 ">Groups</h2>
                      {groupList.map((group, i) => (
                        <div
                          className="flex p-3 mt-2 bg-gray-800 border rounded cursor-pointer"
                          key={i}
                          onClick={() => handleGroupRedirect(group)}
                        >
                          <span className="mr-3">{group.groupname}</span>
                          <div className="flex ml-auto">
                            <div className="flex mr-3">
                              <span className="mr-1">
                                {group.members.length}
                              </span>
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
                                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                                />
                              </svg>
                            </div>
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
                      ))}
                    </div>
                  )}
                </div>
              </span>
              {/* Dropdown menu for account */}
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
                    {/* Render account options for user */}
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
          // If user isnt logged in
          <>
            <Link href={"/login"}>
              <button className="m-5 text-primarycolor-lightest">Login </button>
            </Link>
            <Link href={"/register"}>
              <button className="m-5 text-primarycolor-lightest">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default TopNav;
