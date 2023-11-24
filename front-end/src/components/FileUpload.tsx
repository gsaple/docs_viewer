import { type FC } from "react";
import { useState } from "react";
import Progress from "./Progress";
import Message from "./Message";

const FileUpload: FC = () => {
  const [message, setMessage] = useState("");

  const uploadPercentage = 50;
  return (
    <>
      {message && <Message msg={message} setMessage={setMessage} />}
      <Progress uploadPercentage={uploadPercentage} />
    </>
  );
};

export default FileUpload;
