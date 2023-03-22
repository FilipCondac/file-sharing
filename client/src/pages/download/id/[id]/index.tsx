import { GetServerSidePropsContext, NextPage } from "next";
import { IFile } from "libs/types";
import FileRender from "@/components/FileRender";
import TopNav from "@/components/TopNav";
import fileDownload from "js-file-download";
import axios from "axios";
import React, { useState } from "react";
import QRCode from "qrcode";

const index: NextPage<{ file: IFile }> = ({
  file: { format, name, sizeInBytes, id },
}: any) => {
  //Axios request to download file from server and save it to client
  const handleDownload = async () => {
    const { data } = await axios.get(`api/files/id/${id}/download`, {
      responseType: "blob",
    });
    fileDownload(data, name);
  };

  const [qrCodeDataUrl, setQRCodeDataUrl] = useState("");

  const generateQRCode = async () => {
    const downloadPageLink = window.location.href;
    const qrCode = await QRCode.toDataURL(downloadPageLink);

    setQRCodeDataUrl(qrCode);
  };
  return (
    <div className="flex flex-col items-center h-full overflow-auto text-xl text-black font-Raleway bg-primarycolor-dark">
      <TopNav />
      <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full overflow-auto">
        {!id ? (
          <span>File does not exist</span>
        ) : (
          <>
            <div className="fixed flex flex-col mr-96 -ml-96 w-80">
              <h1 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
                Take your sharing to the next level with our intuitive file
                sharing tools.
              </h1>
              <p className="mt-5 text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-600">
                Share files your way
              </p>
              <p className="mt-2 text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-blue-400">
                - Link Sharing
              </p>
              <p className="mt-2 text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-blue-400">
                - Group Sharing
              </p>
              <p className="mt-2 text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-blue-400">
                - QR Sharing
              </p>
              <p className="mt-2 text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-blue-400">
                - Phrase Sharing
              </p>
              <p className="mt-2 text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-blue-400">
                - Email Sharing
              </p>
            </div>
            <div className="m-auto">
              <h1 className="mb-6 font-bold text-gray-300 uppercase">
                Your file is ready for download
              </h1>
              <FileRender file={{ format, name, sizeInBytes }} />
              <div className="m-auto mt-10 text-center">
                {qrCodeDataUrl && (
                  <div className="m-auto">
                    <img
                      src={qrCodeDataUrl}
                      className="m-auto mb-4 border"
                      alt="QR code"
                    />{" "}
                  </div>
                )}
                <button
                  className="flex items-center px-4 py-2 m-auto mb-10 font-bold text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={generateQRCode}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
                    />
                  </svg>

                  <span>Generate QR </span>
                </button>
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
      `${process.env.API_BASE_ENDPOINT}api/files/id/${id}`
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
