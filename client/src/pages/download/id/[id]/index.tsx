import { GetServerSidePropsContext, NextPage } from "next";
import { IFile } from "libs/types";
import FileRender from "@/components/FileRender";
import TopNav from "@/components/TopNav";
import fileDownload from "js-file-download";
import axios from "axios";
import React from "react";

const index: NextPage<{ file: IFile }> = ({
  file: { format, name, sizeInBytes, id },
}: any) => {
  //Axios request to download file from server and save it to client
  const handleDownload = async () => {
    const { data } = await axios.get(
      `http://localhost:8000/api/files/id/${id}/download`,
      {
        responseType: "blob",
      }
    );
    fileDownload(data, name);
  };
  return (
    <div className="flex flex-col items-center h-full text-xl text-black font-Raleway bg-slate-900">
      <TopNav />
      {!id ? (
        <span>File does not exist</span>
      ) : (
        <>
          <div className="m-auto">
            <h1 className="mb-6 font-bold text-gray-300 uppercase">
              Your file is ready for download
            </h1>
            <FileRender file={{ format, name, sizeInBytes }} />
            <div className="m-auto mt-10 text-center">
              <button
                className="inline-flex items-center px-4 py-2 font-bold text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
                onClick={handleDownload}
              >
                <svg
                  className="w-4 h-4 mr-2 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                </svg>
                <span>Download</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default index;

//Axios request to get file from server and pass it to page as props
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;
  let file;
  try {
    const { data } = await axios.get(
      `http://localhost:8000/api/files/id/${id}`
    );
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
