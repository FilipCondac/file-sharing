import axios from "axios";
import fileDownload from "js-file-download";
import React, { useEffect, useState } from "react";
import { calcBytes } from "libs/calcBytes";

const PersonalFiles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userFiles, setUserFiles] = useState([]);
  const [expandedFile, setExpandedFile] = useState(null as number | null);

  const handleDownload = async (id: string, name: string) => {
    const { data } = await axios.get(`api/files/id/${id}/download`, {
      responseType: "blob",
    });
    fileDownload(data, name);
  };

  const filteredFiles = userFiles?.filter((file) =>
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFileDropdown = (fileIndex: number) => {
    if (expandedFile === fileIndex) {
      setExpandedFile(null);
    } else {
      setExpandedFile(fileIndex);
    }
  };

  useEffect(() => {
    getUserFiles();
  }, []);

  const getUserFiles = async () => {
    const { data } = await axios.get("api/files/getUserFiles");
    console.log(data);
    setUserFiles(data.files);
  };
  return (
    <div>
      <h2 className="flex flex-col items-center m-auto mb-5 text-lg font-bold ">
        My files
      </h2>
      <div className="flex flex-col m-auto text-white mt-9 h-96 ">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search files..."
          className="p-2 mt-4 mb-2 text-sm bg-gray-800 border border-gray-700 rounded-md"
        />
        <div className="p-1 overflow-scroll">
          {filteredFiles?.map((file, i) => (
            <div
              key={i}
              className={`flex flex-col p-2 mx-3 mt-3 mb-5 font-light bg-gray-800 border-slate-600  border rounded-sm text-lg ${
                expandedFile === i ? "border-sky-400" : ""
              }`}
            >
              <div>
                <div className="flex">
                  <h1>{file.filename}</h1>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 my-auto ml-auto cursor-pointer"
                    onClick={() => renderFileDropdown(i)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 17.25L12 21m0 0l-3.75-3.75M12 21V3"
                    />
                  </svg>
                </div>
                {expandedFile === i && (
                  <div className="flex flex-col">
                    <div className="flex flex-col">
                      <h1 className="mt-2 text-sm font-bold">
                        File ID: <span className="font-light">{file._id}</span>
                      </h1>
                    </div>
                    <div className="flex flex-col">
                      <h1 className="mt-2 text-sm font-bold">
                        Size:{" "}
                        <span className="font-light">
                          {calcBytes(file.sizeInBytes)}
                          <span className="ml-1 font-bold">mb</span>
                        </span>
                      </h1>
                    </div>
                    <div className="flex flex-col">
                      <h1 className="mt-2 text-sm font-bold">
                        Format:{" "}
                        <span className="font-light">{file.format}</span>
                      </h1>
                    </div>
                    <div className="flex flex-col">
                      <h1 className="mt-2 text-sm font-bold">
                        Download Phrase:{" "}
                        <span className="font-light">{file.displayPhrase}</span>
                      </h1>
                    </div>
                    <div className="flex flex-col">
                      <button
                        className="inline-flex items-center px-4 py-2 m-auto mt-3 font-bold text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
                        onClick={() => handleDownload(file._id, file.filename)}
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
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalFiles;
