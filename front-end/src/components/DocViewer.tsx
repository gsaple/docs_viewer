import { type FC } from "react";
import DocViewer from "@cyntler/react-doc-viewer";

interface DocViewerProps {
  docSrcs: string[];
}

const DocsViewer: FC<DocViewerProps> = ({ docSrcs }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const uris = docSrcs.map((docSrc) => ({
    uri: `${backendUrl}${docSrc}`,
  }));
  return <DocViewer documents={uris} />;
};

export default DocsViewer;
