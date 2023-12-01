import "./App.css";
import FileUpload from "./components/FileUpload";

function App() {
  return (
    <>
      <div className="container my-4">
        <h4 className="display-4 text-center mb-4">Document Viewer</h4>
        <FileUpload />
      </div>
    </>
  );
}

export default App;
