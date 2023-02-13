import DropBox from "@/components/DropBox";
import TopNav from "@/components/TopNav";
import FileRender from "@/components/FileRender";
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

  return (
    <main className="flex flex-col h-full font-raleway dark [--scroll-mt:9.875rem] lg:[--scroll-mt:6.3125rem] dark:bg-slate-900 text-sky-400 ">
      <TopNav />
      <div className="flex flex-col m-auto">
        <div className="items-center m-auto rounded-md h-72 w-96">
          {/* Pass setFile updated variable to the DropBox component */}
          {!file && <DropBox setFile={setFile} />}
          <div className="m-auto text-center rounded-md ">
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
              <button
                className="w-32 m-auto text-white rounded-md bg-sky-400"
                onClick={handleUpload}
              >
                {uploadingStatus}
              </button>
            )}
          </div>
          {downloadPageLink && (
            <div className="m-auto">
              <DownloadFile
                downloadPageLink={downloadPageLink}
                phrase={phrase}
              />
              <button
                className="px-2 mt-5 ml-32 text-center bg-blue-400 rounded-md"
                onClick={resetComponent}
              >
                Upload new file
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default App;
