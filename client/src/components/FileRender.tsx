import { FunctionComponent } from "react";
import { IFile } from "../../libs/types";
import { createImageUri } from "../../libs/imageURI";
import { calcBytes } from "../../libs/calcBytes";

const RenderFile: React.FunctionComponent<{ file: IFile }> = ({
  file: { format, sizeInBytes, name },
}) => {
  return (
    <div className="flex w-full p-4 my-2 font-bold">
      <img
        src={createImageUri(`/images/icons/${format}.png`)}
        alt=""
        className="w-auto h-10"
      />
      <div className="flex flex-col float-left">
        <span className="mx-2 mt-3">Name: {name}</span>
        <span className="mx-2 mt-3">Size: {calcBytes(sizeInBytes)}</span>
      </div>
    </div>
  );
};

export default RenderFile;
