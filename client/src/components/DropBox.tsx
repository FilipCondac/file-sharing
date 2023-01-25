import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const DropBox: React.FunctionComponent<{ setFile: React.Dispatch<any> }> = ({
  setFile,
}) => {
  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles);
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      multiple: false,
    });

  return (
    <div {...getRootProps()} className="">
      <input {...getInputProps()} />
      <h2 className="font-bold">Upload</h2>
      <div className="flex flex-col">
        <img
          src="/images/icons/folder.png"
          alt="folder"
          className="w-16 h-16 m-auto"
        ></img>
        {isDragReject ? (
          <p>File type not accepted</p>
        ) : (
          <div>
            <p className="m-auto">Drag & Drop to upload</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropBox;
