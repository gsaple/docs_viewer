import { type FC } from "react";
import DocViewer from "@cyntler/react-doc-viewer";

interface DocViewerProps {
  docSrcs: { [key: string]: string };
}

const DocsViewer: FC<DocViewerProps> = ({ docSrcs }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const uris = Object.entries(docSrcs).map(([fileName, remoteLoc]) => ({
    uri: `${backendUrl}${remoteLoc}`,
    fileName: fileName,
  }));
  return <DocViewer documents={uris} />;
};

export default DocsViewer;
