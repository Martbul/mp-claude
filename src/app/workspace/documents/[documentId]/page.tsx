
import { QUERIES } from "~/server/db/queries";
import { DocumentViewer } from "./DocumentViewer/page";

export default async function MPClaude(props: { params: Promise<{ documentId: string }> }) {
  const params = await props.params

  const parsedFolderId = parseInt(params.documentId);
  if (isNaN(parsedFolderId)) {
    return <div>Invalid folder ID</div>;
  }

  const [folders, files, parents] = await Promise.all([
    QUERIES.getFolders(parsedFolderId),
    QUERIES.getFiles(parsedFolderId),
    QUERIES.getAllParentsForFolder(parsedFolderId)]) //this lets us remove the await from the folder and fles constants meaning that it wont bloack waithing for the first one to finish
  //now both fetching happens at the same time in paralell
  return <DocumentViewer files={files} folders={folders} parents={parents} currentFolderId={parsedFolderId} />

}
