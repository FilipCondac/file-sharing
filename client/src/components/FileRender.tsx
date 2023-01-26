import { FunctionComponent } from "react";
import { IFile } from "../../libs/types";
import { createImageUri } from "../../libs/imageURI";
import { calcBytes } from "../../libs/calcBytes";

const RenderFile: React.FunctionComponent<{ file: IFile }> = ({
  file: { format, sizeInBytes, name },
}) => {
  return (
    <div className="my-2 flex w-full p-4 font-bold">
      <img
        src={createImageUri(`/images/icons/${format}.png`)}
        alt=""
        className="h-10 w-auto"
      />
      <span className="mx-2 mt-3">{name}</span>
      <span className="ml-auto mt-3">{calcBytes(sizeInBytes)}</span>
    </div>
  );
};

export default RenderFile;
