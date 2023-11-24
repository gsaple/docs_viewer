import { type FC } from "react";

interface ProgressProps {
  uploadPercentage: number;
}

const Progress: FC<ProgressProps> = ({ uploadPercentage }) => {
  return (
    <div className="progress">
      <div
        className="progress-bar progress-bar-striped bg-success"
        role="progressbar"
        style={{ width: `${uploadPercentage}%` }}
      ></div>
    </div>
  );
};

export default Progress;
