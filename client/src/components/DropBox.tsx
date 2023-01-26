import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

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
    });

  return (
    // Apply the props to the dropzone element
    <div {...getRootProps()} className="justify-centre items-center">
      <input {...getInputProps()} />
      <div className="flex flex-col">
        <img
          src="/images/icons/folder.png"
          alt="folder"
          className="m-auto h-16 w-16"
        ></img>
        {/* Add check if files are not accepted display message to user */}
        {isDragReject ? (
          <p>File type not accepted</p>
        ) : (
          <div className="m-auto">
            <p>Drag & Drop to upload</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropBox;
