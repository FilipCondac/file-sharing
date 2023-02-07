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

  return (
    // Apply the props to the dropzone element
    <div
      {...getRootProps()}
      className="items-center h-full justify-centre hover:wiggle"
    >
      <input {...getInputProps()} />
      <div className="flex flex-col">
        <img
          src="/images/icons/folder.png"
          alt="folder"
          className="w-16 h-16 m-auto"
        ></img>
        {/* Add check if files are not accepted display message to user */}
        {isDragReject ? (
          <p>File type not accepted</p>
        ) : (
          <div className="flex flex-col m-auto">
            <p className="w-3/5 m-auto text-center">
              Drag & Drop a file or click this box to begin upload
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
