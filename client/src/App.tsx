import DropBox from "./components/DropBox";
import TopNav from "./components/TopNav";
import FileRender from "./components/FileRender";
import { useState } from "react";
import axios from "axios";
import DownloadFile from "./components/DownloadFile";

const App = () => {
  //Call the useState hook to create a state variable called file
  //and a function called setFile to update the state variable
  const [file, setFile] = useState(null);
  const [id, setID] = useState(null);
  const [downloadPageLink, setdownloadPageLink] = useState(null);
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
      setID(data.id);
    } catch (error: any) {
      console.log(error.response.data);
      setUploadingStatus("Upload Failed");
    }
  };

  const resetComponent = () => {
    setFile(null);
    setdownloadPageLink(null);
  };

  return (
    <main className="flex h-screen flex-col font-raleway ">
      <TopNav />
      <div className="m-auto flex flex-col">
        <h2 className="m-auto font-bold">Upload</h2>
        <div className="m-auto h-72 w-96 items-center rounded-md bg-blue-200">
          {/* Pass setFile updated variable to the DropBox component */}
          {!downloadPageLink && <DropBox setFile={setFile} />}
          <div className="m-0 bg-blue-200 text-center">
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
                className="w-32 rounded-md bg-blue-400"
                onClick={handleUpload}
              >
                {uploadingStatus}
              </button>
            )}
          </div>
          {downloadPageLink && (
            <div>
              <DownloadFile downloadPageLink={downloadPageLink} />
              <button
                className="w-32 rounded-md bg-blue-400"
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
