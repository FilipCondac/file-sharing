import DropBox from "./components/DropBox";
import TopNav from "./components/TopNav";
import { useState } from "react";

const App = () => {
  //Call the useState hook to create a state variable called file
  //and a function called setFile to update the state variable
  const [file, setFile] = useState(null);

  return (
    <main className="flex h-screen flex-col font-raleway ">
      <TopNav />
      <div className="m-auto flex flex-col">
        <h2 className="m-auto font-bold">Upload</h2>
        <div className="m-auto h-72 w-96 items-center rounded-md bg-blue-200">
          {/* Pass setFile updated variable to the DropBox component */}
          <DropBox setFile={setFile} />
          <div className="text-center">
            {/* Display the file name */}
            <p className="text-center font-bold">{file?.name}</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default App;
