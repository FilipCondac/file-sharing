import React, { ReactElement } from "react";

const DownloadFile: React.FC = ({ downloadPageLink, phrase }): ReactElement => {
  return (
    <div className="p-1">
      <div className="flex flex-col">
        <div className="flex flex-col m-auto">
          <span className="m-auto font-semibold"> Download Link: </span>
          <div className="flex">
            <span className="m-auto text-center break-all">
              {downloadPageLink}
            </span>
            <img
              src="/images/icons/copy-solid.svg"
              className="object-contain w-8 h-8 mt-2 cursor-pointer"
              onClick={() => navigator.clipboard.writeText(downloadPageLink)}
            ></img>
          </div>
        </div>
        <div className="flex flex-col m-auto">
          <span className="m-auto font-semibold"> Phrase: </span>
          <span className="w-full m-auto uppercase"> {phrase} </span>
        </div>
      </div>
    </div>
  );
};

export default DownloadFile;
