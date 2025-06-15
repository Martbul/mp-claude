import { db } from "~/server/db"
import { mockFolders, mockFiles } from "~/lib/mock-data"
import { files_table, folders_table } from "~/server/db/schema";

import { sql } from "drizzle-orm";

export default function SandboxPage() {
  return (<div className="flex flex-col gap-4">

    Seed function{" "}
    <form
      action={async () => {
        "use server"; //tell the client to be able to call thid function --Theo
        // mens that whatever logic is here, it will be called after the submit of the form

        await db.execute(sql`TRUNCATE TABLE ${folders_table}`);
        await db.execute(sql`TRUNCATE TABLE ${files_table}`);
        const folderInsert = await db.insert(folders_table).values(
          mockFolders.map((folder, index) => ({
            id: index + 1,
            name: folder.name,
            parent: index !== 0 ? 1 : null,
          })),
        );
        const fileInsert = await db.insert(files_table).values(
          mockFiles.map((file, index) => ({
            id: index + 1,
            name: file.name,
            size: 5000,
            url: file.url,
            parent: (index % 3) + 1,
          })),
        )

        console.log(folderInsert);
        console.log(fileInsert);
      }}
    >
      <button type="submit">Seed</button>
    </form>
  </div>
  )
}
