import DropBox from "@/components/DropBox";
import TopNav from "@/components/TopNav";
import FileRender from "@/components/FileRender";
import PhraseSearch from "@/components/PhraseSearch";
import { useState } from "react";
import axios from "axios";
import DownloadFile from "@/components/DownloadFile";
import React from "react";
import authorizedStatus from "../../libs/authorizedStatus";
import AccountOptions from "@/components/AccountOptions";
import QRCode from "qrcode";
import PersonalFiles from "@/components/PersonalFiles";

const App = () => {
  //Call the useState hook to create a state variable called file
  //and a function called setFile to update the state variable
  const [componentRender, setComponentRender] = useState(true);
  const [file, setFile] = useState(null);
  const [id, setID] = useState(null);
  const [downloadPageLink, setdownloadPageLink] = useState(null);
  const [phrase, setPhrase] = useState(null);
  const [accountOptions, setAccountOptions] = React.useState(false);
  const [uploadingStatus, setUploadingStatus] = useState<
    "Uploading" | "Upload Failed" | "Uploaded" | "Upload"
  >("Upload");
  const [qrCodeDataUrl, setQRCodeDataUrl] = useState("");

  const isAuthorized = authorizedStatus();

  /* The code bellow does the following:
1. The handleUpload function is called when the user clicks the upload button.
2. The handleUpload function checks if the upload status is currently uploading, if it is, then it does not do anything.
3. The handleUpload function sets the upload status to uploading.
4. The handleUpload function creates a new form data object.
5. The handleUpload function appends the file to the form data object.
6. The handleUpload function creates an axios request with the form data.
7. The handleUpload function sends the axios request to the API.
8. The handleUpload function sets the downloadPageLink, phrase, and id to the data recieved from the API. */

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

  // The code bellow does the following:
  // 1. The resetComponent function is called when the user clicks the x button.
  const resetComponent = () => {
    setFile(null);
    setPhrase(null);
    setdownloadPageLink(null);
    setQRCodeDataUrl("");
    setUploadingStatus("Upload");
  };

  const generateQRCode = async () => {
    if (downloadPageLink) {
      const qrCode = await QRCode.toDataURL(downloadPageLink);
      setQRCodeDataUrl(qrCode);
    }
  };

  return (
    <main className="flex flex-col h-full overflow-y-auto sm:overflow-auto bg-primarycolor-dark font-Raleway">
      <TopNav
        isAuthorized={isAuthorized}
        setAccountOptions={setAccountOptions}
      />
      <div className="flex items-center justify-center w-full h-full m-auto">
        {!accountOptions ? (
          <div className="flex ">
            <div className="flex flex-col w-1/4 ml-10 h-80">
              <h1 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
                Take your sharing to the next level with our intuitive file
                sharing tools.
              </h1>
              <p className="mt-5 text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-600">
                Share files your way
              </p>
              <p className="mt-2 text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-blue-400">
                - Link Sharing
              </p>
              <p className="mt-2 text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-blue-400">
                - Group Sharing
              </p>
              <p className="mt-2 text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-blue-400">
                - QR Sharing
              </p>
              <p className="mt-2 text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-blue-400">
                - Phrase Sharing
              </p>
              <p className="mt-2 text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-blue-400">
                - Email Sharing
              </p>
            </div>
            <div className="flex w-2/3 p-5 ml-2 mr-5 border rounded bg-gradient-to-r from-slate-800 to-slate-900">
              <div className="flex flex-col w-1/2">
                {!file && (
                  <div className="m-auto">
                    <h1 className="m-auto mb-5 text-lg font-bold text-center text-white">
                      Search files by phrase
                    </h1>
                    <PhraseSearch setComponentRender={setComponentRender} />
                  </div>
                )}

                <div className="flex flex-col m-auto ">
                  <div className="h-auto m-auto w-96">
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

                    <div className="m-auto ">
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
                  </div>
                </div>
              </div>
              <div className="w-1/2 mr-5 ">
                <div className="">{!downloadPageLink && <PersonalFiles />}</div>

                {downloadPageLink && (
                  <div className="m-auto mt-10 overflow-scroll">
                    <DownloadFile
                      downloadPageLink={downloadPageLink}
                      phrase={phrase}
                    />
                    {qrCodeDataUrl && (
                      <div className="m-auto">
                        <img
                          src={qrCodeDataUrl}
                          className="m-auto mb-4 border"
                          alt="QR code"
                        />{" "}
                      </div>
                    )}
                    <button
                      className="flex items-center px-4 py-2 m-auto mb-10 font-bold text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
                      onClick={generateQRCode}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 mr-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
                        />
                      </svg>

                      <span>Generate QR </span>
                    </button>

                    <div className="m-auto">
                      <button
                        className="flex items-center px-4 py-2 m-auto mb-10 font-bold text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
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
          </div>
        ) : (
          <div className="flex flex-col mx-auto mt-32">
            <AccountOptions />
          </div>
        )}
      </div>
    </main>
  );
};

export default App;
