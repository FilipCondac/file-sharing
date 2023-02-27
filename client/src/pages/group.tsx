import TopNav from "@/components/TopNav";
import axios from "axios";
import { Group } from "next/dist/shared/lib/router/utils/route-regex";
import { useRouter } from "next/router";
import authorizedStatus from "../../libs/authorizedStatus";
import React, { useEffect, useState } from "react";
import AccountOptions from "@/components/AccountOptions";
import DropBox from "@/components/DropBox";
import FileRender from "@/components/FileRender";

const group = () => {
  const router = useRouter();
  const isAuthorized = authorizedStatus();

  const [group, setGroup] = React.useState<Group | null>(null);
  const [accountOptions, setAccountOptions] = React.useState(false);
  const [groupFiles, setGroupFiles] = React.useState<File[] | null>(null);

  useEffect(() => {
    // Call your function here
    getGroup();
  }, [router.query.groupID]);

  useEffect(() => {
    // Call your function here
    getFiles();
  }, [router.query.groupID]);

  const getGroup = async () => {
    console.log(router.query);
    const { groupID } = router.query;
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/files/group/${groupID}`
      );
      console.log(data);
      setGroup(data);
    } catch (error: any) {
      console.log(error.response.data);
      setGroup(null);
    }
  };

  const [file, setFile] = useState(null);
  const [id, setID] = useState(null);
  const [uploadingStatus, setUploadingStatus] = useState<
    "Uploading" | "Upload Failed" | "Uploaded" | "Upload"
  >("Upload");

  const handleUpload = async () => {
    if (uploadingStatus === "Uploading") return;
    setUploadingStatus("Uploading");
    const formData = new FormData();
    formData.append("myFile", file);
    const { groupID } = router.query;
    formData.append("groupID", groupID);
    try {
      const { data } = await axios({
        method: "POST",
        data: formData,
        url: "api/files/groupUpload",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setID(data.id);
      setUploadingStatus("Uploaded");
    } catch (error: any) {
      console.log(error);
      setUploadingStatus("Upload Failed");
    }
  };

  const getFiles = async () => {
    const { groupID } = router.query;
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/files/getFilesByGroup/${groupID}`
      );
      console.log(data);
      setGroupFiles(data);
    } catch (error: any) {
      console.log(error.response.data);
      setGroupFiles(null);
    }
  };

  const resetComponent = () => {
    setFile(null);
    setUploadingStatus("Upload");
  };

  return (
    <div className="flex flex-col h-full dark [--scroll-mt:9.875rem] lg:[--scroll-mt:6.3125rem] dark:bg-slate-900 text-sky-400 font-Raleway">
      <TopNav
        isAuthorized={isAuthorized}
        setAccountOptions={setAccountOptions}
      />
      {!accountOptions ? (
        <div className="flex flex-col p-5 m-auto items-center border text-slate-400 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 justify-centre hover:shadow-[0_20px_60px_20px_rgba(235,206,235,0.05)] font-Raleway  w-96">
          {group ? (
            <div>
              <div>
                <h1 className="text-2xl font-bold capitalize">{group.name}</h1>
              </div>
              <div className="flex flex-col p-2 m-auto border rounded-xl">
                <h1 className="font-bold">Files:</h1>
                {groupFiles.files.map((file, i) => (
                  <div key={i}>
                    <h1>{file.filename}</h1>
                  </div>
                ))}
              </div>
              <div className="flex flex-col mt-5">
                {!file && <DropBox setFile={setFile} />}
                {file && (
                  <div onClick={resetComponent} className="z-0 mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="float-right w-6 h-6 mt-2 mr-2 -mb-10 text-gray-400 cursor-pointer hover:text-gray-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                )}

                <div className="m-auto rounded-md ">
                  {/* Display the file name */}
                  {file && (
                    <FileRender
                      file={{
                        format: file.type.split("/")[1],
                        name: file.name,
                        sizeInBytes: file.size,
                      }}
                    />
                  )}

                  {file && (
                    <div className="m-auto">
                      <button
                        className="flex items-center px-4 py-2 m-auto font-bold text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
                        onClick={handleUpload}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 mr-2 m"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                          />
                        </svg>
                        {uploadingStatus}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>Group not found</div>
          )}
        </div>
      ) : (
        <div className="flex flex-col mx-auto mt-32">
          <AccountOptions />
        </div>
      )}
    </div>
  );
};

export default group;

// This gets called to query via phrase
