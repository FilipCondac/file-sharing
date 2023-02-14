// import { FunctionComponent } from "react";
// import { createImageUri } from "../../libs/imageURI";
import { IFile } from "../../libs/types";
import { calcBytes } from "../../libs/calcBytes";
import React from "react";

const RenderFile: React.FunctionComponent<{ file: IFile }> = ({
  file: { format, sizeInBytes, name },
}) => {
  return (
    <div className="flex flex-col w-full items-center h-full shadow-[0_20px_60px_20px_rgba(135,206,235,0.1)] text-white rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 justify-centre hover:wiggle p-5 py-10 mb-5">
      <div className="flex flex-col ">
        <h1 className="m-auto mb-5 font-bold">File Details</h1>
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
