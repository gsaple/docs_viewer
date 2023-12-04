import { type FC } from "react";
import { useState, useEffect } from "react";
import Progress from "./Progress";
import Message from "./Message";
import DocsViewer from "./DocViewer";
import { niceBytes, mimeTypeToString } from "../utils/file";
import axiosInstance from "../utils/axios";
import axios from "axios";

const FileUpload: FC = () => {
  const allowedTotalSize = 50 * 1024 * 1024; // 50 Mb
  const [message, setMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<string>("success");
  const [showUploadInfo, setShowUploadInfo] = useState<boolean>(false);
  const [showViewDocs, setShowViewDocs] = useState<boolean>(false);
  const [uploadPercentage, setUploadPercentage] = useState<{
    [key: string]: number;
  }>({});
  const [remoteFilePaths, setRemoteFilePaths] = useState<string[]>([]);
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);
  const supportedFileType: { [key: string]: string } = {
    "image/bmp": "bmp",
    "text/csv": "csv",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
    "image/gif": "gif",
    "text/htm": "htm",
    "text/html": "html",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
    "video/mp4": "mp4",
    "application/vnd.oasis.opendocument.text": "odt",
    "application/pdf": "pdf",
    "image/png": "png",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "pptx",
    "image/tiff": "tiff",
    "text/plain": "txt",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  };

  useEffect(() => {
    window.addEventListener("beforeunload", deleteFiles);
    return () => {
      window.removeEventListener("beforeunload", deleteFiles);
    };
  }, [remoteFilePaths]);

  const uploadOneFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axiosInstance.post("/upload", formData, {
        onUploadProgress: (progressEvent) => {
          setUploadPercentage((prevUploadPercentage) => ({
            ...prevUploadPercentage,
            [file.name]: Math.round((progressEvent.progress || 0) * 100),
          }));
        },
      });
      setRemoteFilePaths((prevRemoteFilePaths) => [
        ...prevRemoteFilePaths,
        response.data.filePath,
      ]);
      setUploadedFileNames((alreadyUploadedFileNames) => [
        ...alreadyUploadedFileNames,
        file.name,
      ]);
    } catch (error) {
      setUploadPercentage((prevUploadPercentage) => ({
        ...prevUploadPercentage,
        [file.name]: 0,
      }));
      console.error(`Error when uploading file ${file.name}`);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.error || "Unknown Server Error");
      } else {
        throw new Error((error as Error).message);
      }
    }
  };

  const uploadFiles = async (filesList: FileList) => {
    const files: File[] = Array.from(filesList).filter(
      (file) => !uploadedFileNames.includes(file.name)
    );

    try {
      const uploadPromises = files.map(async (file) => uploadOneFile(file));
      await Promise.all(uploadPromises);
      setMessage("All files uploaded successfully");
      setAlertType("success");
    } catch (error) {
      setMessage((error as Error).message);
      setAlertType("danger");
    }
  };

  async function deleteFiles() {
    if (remoteFilePaths.length === 0) return;
    const fileNames = remoteFilePaths.join(",");
    try {
      const response = await axiosInstance.delete(
        `/delete?fileNames=${fileNames}`
      );
      setUploadPercentage({});
      setRemoteFilePaths([]);
      setUploadedFileNames([]);
      setMessage(response.data.message);
      setAlertType("success");
      setShowViewDocs(false);
    } catch (error) {
      console.error("Error deleting files:", (error as Error).message);
    }
  }

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      let uploadedSize = 0;
      for (const file of files) {
        uploadedSize += file.size;
      }
      if (uploadedSize > allowedTotalSize) {
        setMessage(
          `Selected File(s) Size (${niceBytes(
            uploadedSize
          )}) Exceeds the ${niceBytes(allowedTotalSize)} Limit`
        );
        setAlertType("danger");
        return;
      }
      await uploadFiles(files);
    }
  };

  return (
    <div className="upload-container">
      {message && (
        <Message msg={message} setMessage={setMessage} type={alertType} />
      )}
      <p className="fs-5 text-nowrap">
        <span className="text-muted">supported file types: </span>
        <span className="text-secondary">
          {mimeTypeToString(supportedFileType)}
        </span>
      </p>
      <input
        className="position-absolute opacity-0 z-n1"
        id="upload-files"
        type="file"
        multiple
        onChange={onChange}
        accept={Object.keys(supportedFileType).join(",")}
      />
      <div className="d-flex justify-content-center gap-3">
        <label
          htmlFor="upload-files"
          className="btn btn-primary"
          onClick={() => {
            setShowUploadInfo(true);
            setShowViewDocs(false);
          }}
        >
          Browse Files
        </label>
        {remoteFilePaths.length > 0 && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setShowViewDocs(true);
              setShowUploadInfo(false);
            }}
          >
            View Docs
          </button>
        )}
        {remoteFilePaths.length > 0 && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={deleteFiles}
          >
            Delete Docs
          </button>
        )}
      </div>

      {showUploadInfo && (
        <div>
          {Object.entries(uploadPercentage).map(
            ([fileName, percentage], index) =>
              percentage > 0 && (
                <Progress
                  key={index}
                  uploadPercentage={percentage}
                  fileName={fileName}
                />
              )
          )}
        </div>
      )}
      {showViewDocs && <DocsViewer docSrcs={remoteFilePaths} />}
    </div>
  );
};

export default FileUpload;
