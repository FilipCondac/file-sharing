import Link from "next/link";
import React from "react";
import authorizedStatus from "libs/authorizedStatus";
import logout from "libs/logout";

const TopNav = (props: any) => {
  const [user, setUser] = React.useState(null);
  const [dropdown, setDropdown] = React.useState(false);

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

  const renderAccountOptions = () => {
    props.setAccountOptions(true);
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
            <div
              className="flex w-16 h-auto p-0 mt-3 ml-auto cursor-pointer"
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
                    <span className="">Username</span>
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
