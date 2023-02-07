import { FunctionComponent } from "react";
import { IFile } from "../../libs/types";
import { createImageUri } from "../../libs/imageURI";
import { calcBytes } from "../../libs/calcBytes";

const RenderFile: React.FunctionComponent<{ file: IFile }> = ({
  file: { format, sizeInBytes, name },
}) => {
  return (
    <div className="flex flex-col w-full -mt-6 font-bold">
      <div className="flex flex-col ">
        <span className="m-6 mt-3 text-center ">Name: {name}</span>
        <div className="flex m-auto mt-0">
          <span className="">Format: {format.toUpperCase()} </span>
          <img src={`/images/icons/${format}.png`} alt="" className="w-6 h-6" />
        </div>
        <span className="m-auto mt-3 text-center">
          Size: {calcBytes(sizeInBytes)}
        </span>
      </div>
    </div>
  );
};

export default RenderFile;
