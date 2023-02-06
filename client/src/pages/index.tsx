import DropBox from "@/components/DropBox";
import TopNav from "@/components/TopNav";
import FileRender from "@/components/FileRender";
import { useState } from "react";
import axios from "axios";
import DownloadFile from "@/components/DownloadFile";

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
    <main className="flex flex-col h-screen font-raleway ">
      <TopNav />
      <div className="flex flex-col m-auto">
        <h2 className="m-auto font-bold">Upload</h2>
        <div className="items-center m-auto bg-blue-200 rounded-md h-72 w-96">
          {/* Pass setFile updated variable to the DropBox component */}
          {!downloadPageLink && <DropBox setFile={setFile} />}
          <div className="m-0 text-center bg-blue-200">
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
                className="w-32 bg-blue-400 rounded-md"
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
                className="w-32 bg-blue-400 rounded-md"
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
