import axios from "axios";
import React, { useState } from "react";
import { calcBytes } from "libs/calcBytes";
import fileDownload from "js-file-download";

interface Props {}

//Interface for file
interface File {
  id: string;
  name: string;
  format: string;
  sizeInBytes: number;
  // other properties
}

const PhraseSearch = (props: any) => {
  //States
  const [searchTerm, setSearchTerm] = useState("");
  let [file, setFile] = useState<File | null>(null);
  const [fileNotFound, setFileNotFound] = useState(false);

  //   * The bellow above does the following:
  // 1. An async function is created and the event passed in as a parameter.
  // 2. The default action of the event is prevented.
  // 3. The search term is saved as a variable and the spaces are removed.
  // 4. The variable is saved as lowercase.
  // 5. An axios request is made to the server.
  // 6. The data is saved as a variable.
  // 7. The file state is updated with the data.
  // 8. The componentRender state is set to false to hide the SearchForm component. */

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const phrase = searchTerm.replace(/\s/g, "").toLowerCase();
    try {
      const { data } = await axios.get(`api/files/phrase/${phrase}`);
      file = data;
      setFile(file);
      props.setComponentRender(false);
    } catch (error: any) {
      setFileNotFound(true);
      console.log(error);
    }
  };

  /* The bellow above does the following:
1. It makes an axios request to the backend and gets a blob of data
2. Then it uses the fileDownload library to download the data to the browser
3. After the download is complete, it resets the component */

  const handleDownload = async () => {
    if (file) {
      const { data } = await axios.get(`api/files/id/${file.id}/download`, {
        responseType: "blob",
      });
      fileDownload(data, file.name);
    }
  };

  /* The bellow bellow does the following:
1. It resets the component by setting the file state to null and the componentRender state to true */
  const resetComponent = () => {
    setFile(null);
    props.setComponentRender(true);
  };

  return (
    <div className="flex flex-col items-center p-5 m-auto mb-10 text-primarycolor-lightest rounded-xl justify-centre font-Raleway">
      {/* The code bellow does the following:
    1. It checks if the file variable is undefined or not. If it is undefined, then it shows a form to search for the file.
    2. If the file variable is defined, then it shows the file contents. */}
      {!file && (
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              className="p-1 rounded-lg bg-slate-700 "
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button type="submit" className="ml-3">
              Search
            </button>
          </form>
        </div>
      )}

      {/* The code bellow does the following:
        1. A function called resetComponent is called when the user clicks on the close button.
        2. The function resets the file state variable to null, which triggers the change in the conditional rendering.
        3. The file details are displayed to the user.
        4. The user can download the file. */}
      {fileNotFound && (
        <div className="mt-2">
          <h1 className="text-red-500">File not found</h1>
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
              Size: {calcBytes(file.sizeInBytes.toString())}
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
