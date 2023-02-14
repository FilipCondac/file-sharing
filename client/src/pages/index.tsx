import DropBox from "@/components/DropBox";
import TopNav from "@/components/TopNav";
import FileRender from "@/components/FileRender";
import PhraseSearch from "@/components/PhraseSearch";
import { useState } from "react";
import axios from "axios";
import DownloadFile from "@/components/DownloadFile";
import React from "react";

const App = () => {
  //Call the useState hook to create a state variable called file
  //and a function called setFile to update the state variable
  const [file, setFile] = useState(null);
  const [id, setID] = useState(null);
  const [downloadPageLink, setdownloadPageLink] = useState(null);
  const [phrase, setPhrase] = useState(null);
  const [uploadingStatus, setUploadingStatus] = useState<
    "Uploading" | "Upload Failed" | "Uploaded" | "Upload"
  >("Upload");

  const handleUpload = async () => {
    if (uploadingStatus === "Uploading") return;
    setUploadingStatus("Uploading");
    const formData = new FormData();
    formData.append("myFile", file);

    try {
      const { data } = await axios({
        method: "POST",
        data: formData,
        url: "api/files/upload",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setdownloadPageLink(data.downloadPageLink);
      setPhrase(data.phrase);
      setID(data.id);
    } catch (error: any) {
      console.log(error);
      setUploadingStatus("Upload Failed");
    }
  };

  const resetComponent = () => {
    setFile(null);
    setPhrase(null);
    setdownloadPageLink(null);
  };

  let [componentRender, setComponentRender] = useState(true);

  const hideComponent = () => {
    componentRender = false;
  };

  return (
    <main className="flex flex-col h-full font-raleway dark [--scroll-mt:9.875rem] lg:[--scroll-mt:6.3125rem] dark:bg-slate-900 text-sky-400 ">
      <TopNav />
      {!file && (
        <div className="m-auto">
          <h1 className="m-auto mb-5 text-lg font-bold text-center text-gray-400">
            Search files by phrase
          </h1>
          <PhraseSearch setComponentRender={hideComponent} />
        </div>
      )}
      <div className="flex flex-col m-auto">
        <div className="m-auto rounded-md h-72 w-96">
          {/* Pass setFile updated variable to the DropBox component */}
          {!file && componentRender && <DropBox setFile={setFile} />}
          {file && (
            <div onClick={resetComponent}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="float-right w-6 h-6 mt-2 mr-2 -mb-10 text-gray-400 cursor-pointer hover:text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
          <div className="m-auto rounded-md ">
            {/* Display the file name */}
            {file && (
              <FileRender
                file={{
                  format: file.type.split("/")[1],
                  name: file.name,
                  sizeInBytes: file.size,
                }}
              />
            )}
            {!downloadPageLink && file && (
              <div className="m-auto">
                <button
                  className="flex items-center px-4 py-2 m-auto font-bold text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={handleUpload}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 mr-2 m"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                  {uploadingStatus}
                </button>
              </div>
            )}
          </div>
          {downloadPageLink && (
            <div className="m-auto">
              <DownloadFile
                downloadPageLink={downloadPageLink}
                phrase={phrase}
              />
              <div className="m-auto">
                <button
                  className="flex items-center px-4 py-2 m-auto font-bold text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={resetComponent}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 mr-2 m"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                  <span>Upload new file </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default App;
