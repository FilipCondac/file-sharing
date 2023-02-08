import React, { ReactElement } from "react";

const DownloadFile: React.FC = ({ downloadPageLink, phrase }): ReactElement => {
  return (
    <div className="p-1">
      <div className="flex">
        <span className="break-all"> {downloadPageLink}</span>
        <span className="w-full"> {phrase} </span>
        <img
          src="/images/icons/copy-solid.svg"
          className="object-contain w-8 h-8 cursor-pointer"
          onClick={() => navigator.clipboard.writeText(downloadPageLink)}
        ></img>
      </div>
    </div>
  );
};

export default DownloadFile;
