import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import React from "react";

const DropBox: React.FunctionComponent<{ setFile: React.Dispatch<any> }> = ({
  setFile,
}) => {
  // useCallback is used to memoize the function so that it is not recreated
  // on every render
  const onDrop = useCallback((acceptedFiles: any) => {
    // Call the setFile function to update the file state variable
    // Calls at index 0 because we are only allowing one file to be uploaded
    console.log(acceptedFiles);
    setFile(acceptedFiles[0]);
  }, []);

  // useDropzone is a hook provided by react-dropzone that handles the
  // drag and drop functionality and returns the props to be applied to
  // the dropzone element

  // useDropZone options are set to accept only single files
  // can be set to accept only specific file types
  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: {
        // "application/zip": [".zip", ".rar", ".7z"],
        // "application/msword": [".doc", ".docx"],
        "application/pdf": [".pdf"],
        "image/png": [".png"],
        "image/jpeg": [".jpeg", ".jpg"],
        "voice/mp3": [".mp3"],
      },
    });

  // Set the main class to the default class and change it if the file is accepted or rejected
  let mainClass =
    "items-center h-full  text-primarycolor-lightest rounded  justify-centre";
  if (isDragReject) {
    mainClass = "items-center h-full  text-red-500 rounded  justify-centre";
  } else if (isDragAccept) {
    mainClass = "items-center h-full  text-green-400 rounded  justify-centre";
  }

  return (
    // Apply the props to the dropzone element
    <div {...getRootProps()} className={mainClass}>
      <input {...getInputProps()} />
      <div className="flex flex-col">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-16 h-16 m-auto"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 13.5l3 3m0 0l3-3m-3 3v-6m1.06-4.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
          />
        </svg>

        {/* Add check if files are not accepted display message to user */}
        {isDragReject ? (
          <p className="m-auto">File type not accepted</p>
        ) : (
          <div className="flex flex-col m-auto">
            <p className="w-3/5 m-auto text-center">
              Drag & Drop a file or click here to begin upload
            </p>
            <p className="w-3/5 m-auto text-center mt-28">
              Accepts PNG, JPEG, JPG, MP3 & PDF
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropBox;
