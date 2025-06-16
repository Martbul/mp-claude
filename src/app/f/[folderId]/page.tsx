import ClaudeContents from "~/app/claude-contents";
import { QUERIES } from "~/server/db/queries";

export default async function MPClaude(props: { params: Promise<{ folderId: string }> }) {
	const params = await props.params

	const parsedFolderId = parseInt(params.folderId);
	if (isNaN(parsedFolderId)) {
		return <div>Invalid folder ID</div>;
	}

	const [folders, files, parents] = await Promise.all([
		QUERIES.getFolders(parsedFolderId),
		QUERIES.getFiles(parsedFolderId),
		QUERIES.getAllParentsForFolder(parsedFolderId)]) //this lets us remove the await from the folder and fles constants meaning that it wont bloack waithing for the first one to finish
	//now both fetching happens at the same time in paralell
	return <ClaudeContents files={files} folders={folders} parents={parents} currentFolderId={parsedFolderId} />

}

