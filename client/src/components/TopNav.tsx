const TopNav = () => {
  return (
    <div className="h-16 w-full p-0">
      <div className="float-left -mt-16 overflow-hidden">
        <img
          src="/images/logo.png"
          alt="logo"
          className="h-48 w-64 overflow-hidden object-cover"
        ></img>
      </div>
      <div className="float-right m-3 mt-1 text-lg font-bold">
        <button className="m-5">Login </button>
        <button className="m-5">Sign Up</button>
      </div>
    </div>
  );
};

export default TopNav;
