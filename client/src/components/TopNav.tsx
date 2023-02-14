import Link from "next/link";
import React from "react";

const TopNav: React.FC = () => {
  return (
    <div className="w-full h-16 p-0">
      <div className="float-left">
        <h2 className="w-64 h-48 m-4 text-4xl font-bold text-gray-600 ">
          <Link href={"/"}> SharePal </Link>
        </h2>
      </div>
      <div className="float-right m-3 mt-1 text-lg font-bold">
        <button className="m-5">Login </button>
        <button className="m-5">Sign Up</button>
      </div>
    </div>
  );
};

export default TopNav;
