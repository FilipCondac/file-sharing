import { GetServerSidePropsContext, NextPage } from "next";
import { IFile } from "libs/types";
import FileRender from "@/components/FileRender";
import axios from "axios";
import React from "react";

const index: NextPage<{ file: IFile }> = ({
  file: { format, name, sizeInBytes, id },
}: any) => {
  return (
    <div className="flex flex-col items-center w-full text-xl text-black">
      {!id ? (
        <span>File does not exist</span>
      ) : (
        <>
          <img src="https://img.icons8.com/ios/50/000000/pdf-2.png" />
          <h1>File ready for download</h1>
          <FileRender file={{ format, name, sizeInBytes }} />
          <button>Download</button>
        </>
      )}
    </div>
  );
};

export default index;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;
  let file;
  try {
    const { data } = await axios.get(`http://localhost:8000/api/files/${id}`);
    file = data;
  } catch (error: any) {
    console.log(error.response.data);
    file = {};
  }

  return {
    props: {
      file,
    }, // will be passed to the page component as props
  };
}
