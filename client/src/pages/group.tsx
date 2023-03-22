//@ts-ignore
//@ts-nocheck
import TopNav from "@/components/TopNav";
import axios from "axios";
import { Group } from "next/dist/shared/lib/router/utils/route-regex";
import { useRouter } from "next/router";
import authorizedStatus from "../../libs/authorizedStatus";
import React, { useEffect, useState } from "react";
import AccountOptions from "@/components/AccountOptions";
import DropBox from "@/components/DropBox";
import FileRender from "@/components/FileRender";
import fileDownload from "js-file-download";
import { calcBytes } from "libs/calcBytes";

const group = () => {
  const router = useRouter();
  const isAuthorized = authorizedStatus();

  const [group, setGroup] = React.useState<Group | null>(null);
  const [accountOptions, setAccountOptions] = React.useState(false);
  const [groupFiles, setGroupFiles] = React.useState<File[] | null>(null);
  const [expandedFile, setExpandedFile] = useState(null as number | null);
  const [searchQuery, setSearchQuery] = useState("");
  const [file, setFile] = useState(null);
  const [id, setID] = useState(null);
  const [uploadingStatus, setUploadingStatus] = useState<
    "Uploading" | "Upload Failed" | "Uploaded" | "Upload"
  >("Upload");
  const [groupCreator, setGroupCreator] = useState(false);

  useEffect(() => {
    getFiles();
    getGroup();
    // getUsername(group?.members);
  }, [router.query.groupID, uploadingStatus]);

  useEffect(() => {
    groupOwner();
  }, [group]);

  const getGroup = async () => {
    const { groupID } = router.query;

    try {
      const { data } = await axios.get(`api/files/group/${groupID}`);
      setGroup(data);
    } catch (error: unknown) {
      console.log(error);
      setGroup(null);
    }
  };

  const handleDownload = async (id: string, name: string) => {
    const { data } = await axios.get(`api/files/id/${id}/download`, {
      responseType: "blob",
    });
    fileDownload(data, name);
  };

  const handleUpload = async () => {
    if (uploadingStatus === "Uploading") return;
    setUploadingStatus("Uploading");
    const formData = new FormData();
    if (file) {
      formData.append("myFile", file);
    }

    const { groupID } = router.query;
    if (groupID) {
      formData.append("groupID", groupID);
    }

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

  const handleLeave = async () => {
    try {
      const { data } = await axios.post("api/files/leaveGroup", {
        groupID: router.query.groupID,
      });

      window.location.href = "/";
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      const confirmed = window.confirm(
        "ARE YOU SURE YOU WANT TO DELETE GROUP? THIS CANNOT BE UNDONE."
      );
      const id = router.query.groupID;
      if (confirmed) {
        const { data } = await axios.delete(`api/files/deleteGroup/${id}`);
        window.location.href = "/";
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const groupOwner = async () => {
    const dataUser = await isAuthorized;
    const groupCreator = await group?.creator;
    if (dataUser?.uid === groupCreator) {
      setGroupCreator(true);
    } else {
      setGroupCreator(false);
    }
  };

  const getFiles = async () => {
    const { groupID } = router.query;
    try {
      const { data } = await axios.get(`api/files/getFilesByGroup/${groupID}`);

      setGroupFiles(data);
    } catch (error: any) {
      console.log(error);
      setGroupFiles(null);
    }
  };

  const resetComponent = () => {
    setFile(null);
    setUploadingStatus("Upload");
  };

  const renderFileDropdown = (fileIndex: number) => {
    if (expandedFile === fileIndex) {
      setExpandedFile(null);
    } else {
      setExpandedFile(fileIndex);
    }
  };

  const filteredFiles = groupFiles?.files.filter((file) =>
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-full text-white bg-primarycolor-dark font-Raleway">
      <TopNav
        isAuthorized={isAuthorized}
        setAccountOptions={setAccountOptions}
      />
      {!accountOptions ? (
        <div className="flex flex-col items-center p-5 m-auto ">
          {group ? (
            <div className="flex p-4 mb-8 mr-10 font-bold text-white border rounded border-slate-600 bg-gradient-to-r from-slate-800 to-slate-900 justify-centre font-Raleway">
              {/* Group details */}
              <div className="mr-24 capitalize">
                <div className="">
                  <h1 className="mb-8 text-2xl font-bold capitalize">
                    Group Details
                  </h1>
                </div>
                <div>
                  <h1 className="mb-2 text-lg font-bold">Name:</h1>
                  <h1 className="mb-2 text-lg font-light text-sky-400">
                    {group.name}
                  </h1>
                </div>
                <div>
                  <h1 className="mb-2 text-lg font-bold">Phrase:</h1>
                  <h1 className="mb-2 text-lg font-light text-sky-400">
                    {group.phrase}
                  </h1>
                </div>
                <div>
                  <h1 className="mb-2 text-lg font-bold">Number of Members:</h1>
                  <h1 className="mb-2 text-lg font-light text-sky-400">
                    {group.members.length}
                  </h1>
                </div>
                <div>
                  <h1 className="mb-2 text-lg font-bold">Number of Files:</h1>
                  <h1 className="mb-2 text-lg font-light text-sky-400">
                    {groupFiles?.files.length}
                  </h1>
                </div>
                <div>
                  <h1 className="mb-2 text-lg font-bold">Owner:</h1>
                  <h1 className="mb-2 text-lg font-light text-sky-400">
                    {group.membersDisplay[0]}
                  </h1>
                </div>
                <div>
                  {!groupCreator && (
                    <div
                      className="flex justify-center p-1 mt-10 text-center bg-red-600 border rounded cursor-pointer"
                      onClick={handleLeave}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 my-auto mr-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                        />
                      </svg>

                      <span className="my-auto font-semibold">Leave Group</span>
                    </div>
                  )}
                  {groupCreator && (
                    <div
                      className="flex justify-center p-1 mt-10 text-center bg-red-600 border rounded cursor-pointer"
                      onClick={handleDelete}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 my-auto mr-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                      <span className="my-auto font-semibold">
                        DELETE GROUP
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="">
                <div>
                  <h1 className="mb-8 text-2xl font-bold capitalize">
                    {group.name}
                  </h1>
                </div>

                {/* files */}
                <h1 className="mb-2 text-lg font-bold">Files:</h1>
                <div className="flex flex-col h-56 p-5 m-auto mb-10 overflow-y-scroll bg-gray-900 border border-slate-700 rounded-xl">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search files..."
                    className="p-2 mb-2 text-sm bg-gray-800 border border-gray-700 rounded-md"
                  />
                  {filteredFiles?.map((file, i) => (
                    <div
                      key={i}
                      className={`flex flex-col p-2 mx-3 mt-3 mb-5 font-light bg-gray-800 border-slate-600  border rounded text-lg ${
                        expandedFile === i ? "border-sky-400" : ""
                      }`}
                    >
                      <div>
                        <div className="flex">
                          <h1>{file.filename}</h1>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 my-auto ml-auto cursor-pointer"
                            onClick={() => renderFileDropdown(i)}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 17.25L12 21m0 0l-3.75-3.75M12 21V3"
                            />
                          </svg>
                        </div>
                        {expandedFile === i && (
                          <div className="flex flex-col">
                            <div className="flex flex-col">
                              <h1 className="mt-2 text-sm font-bold">
                                File ID:{" "}
                                <span className="font-light">{file._id}</span>
                              </h1>
                            </div>
                            <div className="flex flex-col">
                              <h1 className="mt-2 text-sm font-bold">
                                Size:{" "}
                                <span className="font-light">
                                  {calcBytes(file.sizeInBytes.toString())}
                                  <span className="ml-1 font-bold">mb</span>
                                </span>
                              </h1>
                            </div>
                            <div className="flex flex-col">
                              <h1 className="mt-2 text-sm font-bold">
                                Format:{" "}
                                <span className="font-light">
                                  {file.format}
                                </span>
                              </h1>
                            </div>
                            <div className="flex flex-col">
                              <button
                                className="inline-flex items-center px-4 py-2 m-auto mt-3 font-bold text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() =>
                                  handleDownload(file._id, file.filename)
                                }
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
                        )}
                      </div>
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
                        className="w-6 h-6 mt-2 ml-2 mr-2 -mb-10 text-gray-400 cursor-pointer hover:text-gray-500"
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
              {/* Members */}
              <div className="flex">
                <div className="flex flex-col w-full ml-7">
                  <h1 className="text-2xl">Members</h1>
                  {group.membersDisplay?.map((member: string, i: number) => (
                    <div
                      key={i}
                      className="flex flex-col p-2 mt-3 mb-5 font-light bg-gray-800 border rounded border-sky-400"
                    >
                      <span className="w-64 text-lg">{member}</span>
                    </div>
                  ))}
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
