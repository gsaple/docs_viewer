import "./App.css";
import FileUpload from "./components/FileUpload";
import axiosInstance from "./utils/axios";
import { useState, useEffect } from "react";

function App() {
  const [isServerOn, setIsServerOn] = useState<boolean>(false);

  useEffect(() => {
    const wakeUpServer = async () => {
      try {
        const response = await axiosInstance.get("/wake-up-server");
        if (response.data.serverIsOn === true) {
          setIsServerOn(true);
        }
      } catch (error) {
        console.error("Error fetching data:", (error as Error).message);
      }
    };
    wakeUpServer();
  }, []);
  return (
    <>
      {isServerOn ? (
        <div className="container my-4">
          <h4 className="display-4 text-center mb-4">Document Viewer</h4>
          <FileUpload />
        </div>
      ) : (
        <div id="loading" className="d-flex w-50 align-items-center mx-auto">
          <div className="mx-auto">
            <p className="text-center fs-4 fw-bold">
              waiting for the server to wake up ...
            </p>
            <div className="d-flex justify-content-around">
              <div
                className="spinner-border text-success"
                style={{ width: "3rem", height: "3rem" }}
                role="status"
              ></div>
              <div
                className="spinner-border text-danger"
                style={{ width: "3rem", height: "3rem" }}
                role="status"
              ></div>
              <div
                className="spinner-border text-warning"
                style={{ width: "3rem", height: "3rem" }}
                role="status"
              ></div>
              <div
                className="spinner-border text-info"
                style={{ width: "3rem", height: "3rem" }}
                role="status"
              ></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
