import axios from "axios";
import React, { useState } from "react";
import { calcBytes } from "libs/calcBytes";
// import FileRender from "@/components/FileRender";
import fileDownload from "js-file-download";

interface Props {}

const PhraseSearch: React.FC<Props> = (props: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  let [file, setFile] = useState(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const phrase = searchTerm;
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/files/phrase/${phrase}`
      );
      file = data;
      setFile(file);
      props.setComponentRender(false);
      console.log(file);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleDownload = async () => {
    const { data } = await axios.get(
      `http://localhost:8000/api/files/id/${file.id}/download`,
      {
        responseType: "blob",
      }
    );
    fileDownload(data, file.name);
  };

  const resetComponent = () => {
    setFile(null);
    props.setComponentRender(true);
  };

  return (
    <div
      className="flex flex-col p-5 m-auto mb-10 items-center shadow-[0_20px_60px_20px_rgba(135,206,235,0.1)] text-slate-400 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 justify-centre hover:shadow-[0_20px_60px_20px_rgba(235,206,235,0.2)]
    "
    >
      {!file && (
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              className="p-1 rounded-lg bg-slate-700"
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button type="submit" className="ml-3">
              Search
            </button>
          </form>
        </div>
      )}

      {file && (
        <div className="flex flex-col items-center w-full h-full pb-5 text-white justify-centre">
          <div className="flex flex-col ">
            <div onClick={resetComponent}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="float-right w-8 h-8 text-gray-400 cursor-pointer hover:text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="m-auto mb-5 font-bold">File Details</h1>
            <span className="m-6 mt-3 text-center ">Name: {file.name}</span>
            <div className="flex m-auto mt-0">
              <span className="">Format: {file.format.toUpperCase()} </span>
              <img
                src={`/images/icons/${file.format}.png`}
                alt=""
                className="w-6 h-6 ml-2"
              />
            </div>
            <span className="m-auto mt-3 text-center">
              Size: {calcBytes(file.sizeInBytes)}
            </span>
            <div className="m-auto mt-5">
              <button
                className="inline-flex items-center px-4 py-2 font-bold text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
                onClick={handleDownload}
              >
                <svg
                  className="w-4 h-4 mr-2 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                </svg>
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhraseSearch;
