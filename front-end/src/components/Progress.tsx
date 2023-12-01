import { type FC } from "react";

interface ProgressProps {
  uploadPercentage: number;
  fileName: string;
}

const Progress: FC<ProgressProps> = ({ uploadPercentage, fileName }) => {
  return (
    <div className="row mt-4 align-items-center w-75 mx-auto">
      <div className="col-4 text-start">
        <p className="text-secondary overflow-filename mb-0">{fileName}</p>
      </div>
      <div className="col-8">
        <div className="progress">
          <div
            className="progress-bar progress-bar-striped bg-info"
            role="progressbar"
            style={{ width: `${uploadPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
