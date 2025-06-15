
import { files_table, folders_table } from "~/server/db/schema";
import { db } from "~/server/db";
import ClaudeContents from "~/app/claude-contents";
import { eq } from "drizzle-orm";


async function getAllParents(folderId: number) {
	const parents = []
	let currentId: number | null = folderId
	while (currentId !== null) {
		const folder = await db.selectDistinct().from(folders_table).where(eq(folders_table.id, currentId))

		if (!folder[0]) {
			throw new Error("Parent folder not found!")
		}

		parents.unshift(folder[0])
		currentId = folder[0]?.parent
	}
	return parents;
}

export default async function MPClaude(props: { params: Promise<{ folderId: string }> }) {
	const params = await props.params

	const parsedFolderId = parseInt(params.folderId);
	if (isNaN(parsedFolderId)) {
		return <div>Invalid folder ID</div>;
	}
	console.log(parsedFolderId)
	//const folders = await db.select().from(folders_table).where(eq(folders_table.parent, parsedFolderId))
	//const files = await db.select().from(files_table).where(eq(files_table.parent, parsedFolderId))


	const foldersPromise = db.select().from(folders_table).where(eq(folders_table.parent, parsedFolderId))
	const filesPromise = db.select().from(files_table).where(eq(files_table.parent, parsedFolderId))

	const parentsPromise = getAllParents(parsedFolderId)

	const [folders, files, parents] = await Promise.all([foldersPromise, filesPromise, parentsPromise]) //this lets us remove the await from the folder and fles constants meaning that it wont bloack waithing for the first one to finish
	//now both fetching happens at the same time in paralell
	return <ClaudeContents files={files} folders={folders} parents={parents} />

}

