import axios from "axios";
import "../../styles/globals.css";
import React from "react";

axios.defaults.baseURL = "http://localhost:8000/";

function MyApp({ Component, pageProps }: any) {
  return (
    <div className="grid h-screen min-h-full font-serif text-white">
      <div>
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
