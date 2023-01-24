import DropBox from "./components/DropBox";

const App = () => {
  return (
    <main className="flex flex-col h-screen justify-center m-auto">
      <h1 className="text-5xl m-auto">SharePal</h1>
      <div className="w-96 flex flex-col items-center m-auto bg-yellow-500">
        <DropBox />
      </div>
    </main>
  );
};

export default App;
