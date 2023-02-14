import axios from "axios";
import React, { useState } from "react";
import { calcBytes } from "libs/calcBytes";
// import FileRender from "@/components/FileRender";
import fileDownload from "js-file-download";

interface Props {}

const PhraseSearch: React.FC<Props> = () => {
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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {file && (
        <div className="flex flex-col w-full items-center h-full shadow-[0_20px_60px_20px_rgba(135,206,235,0.1)] text-white rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 justify-centre hover:wiggle m-4 p-5 py-10">
          <div className="flex flex-col ">
            <h1 className="mb-5 font-bold">File Details</h1>
            <span className="m-6 mt-3 text-center ">Name: {file.name}</span>
            <div className="flex m-auto mt-0">
              <span className="">Format: {file.format.toUpperCase()} </span>
              <img
                src={`/images/icons/${file.format}.png`}
                alt=""
                className="w-6 h-6"
              />
            </div>
            <span className="m-auto mt-3 text-center">
              Size: {calcBytes(file.sizeInBytes)}
            </span>
            <button onClick={handleDownload}>Download</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhraseSearch;
