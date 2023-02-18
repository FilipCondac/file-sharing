import Link from "next/link";
import React from "react";
import authorizedStatus from "libs/authorizedStatus";
import logout from "libs/logout";

const TopNav = () => {
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

  return (
    <div className="w-full h-16 p-0 text-gray-500">
      <div className="float-left">
        <h2 className="w-64 h-48 m-4 text-4xl font-bold ">
          <Link href={"/"}> SharePal </Link>
        </h2>
      </div>
      <div className="float-right m-3 mt-1 text-lg font-bold text-gray-400">
        {user ? (
          <div>
            Welcome, {user.uid}! <button onClick={logout}>Logout</button>
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
