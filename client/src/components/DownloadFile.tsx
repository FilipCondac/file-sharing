const DownloadFile = ({ downloadPageLink }: any) => {
  return (
    <div className="p-1">
      <div className="flex">
        <span className="break-all"> {downloadPageLink}</span>
        <img
          src="/images/icons/logo.png"
          className="h-8 w-8 cursor-pointer object-contain"
          onClick={() => navigator.clipboard.writeText(downloadPageLink)}
        ></img>
      </div>
    </div>
  );
};

export default DownloadFile;
