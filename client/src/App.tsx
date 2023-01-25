import DropBox from "./components/DropBox";
import TopNav from "./components/TopNav";
import { useState } from "react";

const App = () => {
  const [file, setFile] = useState(null);

  return (
    <main className="flex flex-col h-screen font-raleway ">
      <TopNav />
      <div className="justify-center m-auto w-96 bg-blue-200 rounded-md h-72 cursor-pointed">
        <DropBox setFile={setFile} />
        {file?.name}
      </div>
    </main>
  );
};

export default App;
