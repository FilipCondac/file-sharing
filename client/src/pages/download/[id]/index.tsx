import axios from "axios";
import { GetServerSidePropsContext, NextPage } from "next";
import { IFile } from "libs/types";

const index: NextPage<{ file: IFile }> = ({ file }: any) => {
  return (
    <div className="w-full text-xl">
      <h1>Hello</h1>
    </div>
  );
};

export default index;
