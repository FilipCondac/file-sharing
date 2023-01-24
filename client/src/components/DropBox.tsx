import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const DropBox = () => {
  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <div {...getRootProps()} className="w-full h-8">
      <input {...getInputProps()} />
      <p>Drag files to upload</p>
    </div>
  );
};

export default DropBox;
