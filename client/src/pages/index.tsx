import DropBox from "@/components/DropBox";
import TopNav from "@/components/TopNav";
import FileRender from "@/components/FileRender";
import PhraseSearch from "@/components/PhraseSearch";
import { useEffect, useState } from "react";
import axios from "axios";
import DownloadFile from "@/components/DownloadFile";
import React from "react";
import authorizedStatus from "../../libs/authorizedStatus";
import AccountOptions from "@/components/AccountOptions";
import QRCode from "qrcode";
import fileDownload from "js-file-download";

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
  const [searchQuery, setSearchQuery] = useState("");

  const [userFiles, setUserFiles] = useState([]);
  const [expandedFile, setExpandedFile] = useState(null as number | null);

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

  useEffect(() => {
    getUserFiles();
  }, []);

  const getUserFiles = async () => {
    const { data } = await axios.get("api/files/getUserFiles");
    console.log(data);
    setUserFiles(data.files);
  };

  const generateQRCode = async () => {
    if (downloadPageLink) {
      const qrCode = await QRCode.toDataURL(downloadPageLink);
      setQRCodeDataUrl(qrCode);
    }
  };

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

  return (
    <main className="flex flex-col h-full overflow-auto bg-primarycolor-dark font-Raleway">
      <TopNav
        isAuthorized={isAuthorized}
        setAccountOptions={setAccountOptions}
      />
      <div className="flex items-center justify-center w-full h-full m-auto">
        {!accountOptions ? (
          <div className="flex">
            <div className="flex flex-col w-1/3 ml-10">
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
            <div className="flex flex-col w-1/3 ">
              {!file && (
                <div className="m-auto">
                  <h1 className="m-auto mb-5 text-lg font-bold text-center text-white">
                    Search files by phrase
                  </h1>
                  <PhraseSearch setComponentRender={setComponentRender} />
                </div>
              )}

              <div className="flex flex-col m-auto ">
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
            <div className="w-1/3 mr-5">
              <h2 className="flex flex-col items-center m-auto mb-5 text-lg font-bold">
                My files
              </h2>
              <div className="flex flex-col m-auto mt-9 h-96 text-primarycolor-lightest rounded-xl bg-gradient-to-r from-slate-800 to-slate-900">
                <div className="">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search files..."
                    className="p-2 mt-4 mb-2 ml-40 text-sm bg-gray-800 border border-gray-700 rounded-md"
                  />
                  {filteredFiles?.map((file, i) => (
                    <div
                      key={i}
                      className={`flex flex-col p-2 mx-3 mt-3 mb-5 font-light bg-gray-800 border-slate-600  border rounded-lg text-lg ${
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
                                File ID:{" "}
                                <span className="font-light">{file._id}</span>
                              </h1>
                            </div>
                            <div className="flex flex-col">
                              <h1 className="mt-2 text-sm font-bold">
                                Size:{" "}
                                <span className="font-light">
                                  {file.sizeInBytes}
                                  <span className="ml-1 font-bold">mb</span>
                                </span>
                              </h1>
                            </div>
                            <div className="flex flex-col">
                              <h1 className="mt-2 text-sm font-bold">
                                Format:{" "}
                                <span className="font-light">
                                  {file.format}
                                </span>
                              </h1>
                            </div>
                            <div className="flex flex-col">
                              <button
                                className="inline-flex items-center px-4 py-2 m-auto mt-3 font-bold text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() =>
                                  handleDownload(file._id, file.filename)
                                }
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
