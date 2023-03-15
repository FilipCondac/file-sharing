// import { FunctionComponent } from "react";
// import { createImageUri } from "../../libs/imageURI";
import { IFile } from "../../libs/types";
import { calcBytes } from "../../libs/calcBytes";
import React from "react";

const RenderFile: React.FunctionComponent<{ file: IFile }> = ({
  file: { format, sizeInBytes, name },
}) => {
  return (
    <div className="flex flex-col items-center p-10 mb-5 border rounded w-96 bg-gradient-to-r from-slate-800 to-slate-900 justify-centre hover:wiggle text-primarycolor-lightest">
      <div className="flex flex-col ">
        <h1 className="m-auto mb-5 text-2xl font-bold">File Details</h1>
        <span className="m-6 mt-3 text-center ">Name: {name}</span>
        <div className="flex m-auto mt-0">
          <span className="">Format: {format.toUpperCase()} </span>
          <img
            src={`/images/icons/${format}.png`}
            alt=""
            className="w-6 h-6 ml-3"
          />
        </div>
        <span className="m-auto mt-3 text-center">
          Size: {calcBytes(sizeInBytes)}
        </span>
      </div>
    </div>
  );
};

export default RenderFile;
