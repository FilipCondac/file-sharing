import axios from "axios";
import "../../styles/globals.css";
import React from "react";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_ENDPOINT;

function MyApp({ Component, pageProps }: any) {
  return (
    <div className="grid h-screen min-h-full text-white font-raleway">
      <div>
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
