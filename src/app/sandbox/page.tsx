import { db } from "~/server/db"
import { mockFolders, mockFiles } from "~/lib/mock-data"
import { files_table, folders_table } from "~/server/db/schema";

import { eq, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export default async function SandboxPage() {
  const user = await auth()
  if (!user.userId) {
    throw new Error("user npt found")
  }


  const folders = await db.select().from(folders_table).where(eq(folders_table.ownerId, user.userId))

  console.log(folders)
  return (<div className="flex flex-col gap-4">

    Seed function{" "}
    <form
      action={async () => {
        "use server"; //tell the client to be able to call thid function --Theo
        // mens that whatever logic is here, it will be called after the submit of the form
        //

        const user = await auth()
        if (!user.userId) {
          throw new Error("user npt found")
        }

        const rootFolder = await db.insert(folders_table).values({
          name: "root",
          ownerId: user.userId,
          parent: null

        }).$returningId()


        const insertableFolders = mockFolders.map((folder) => ({
          name: folder.name,
          parent: rootFolder[0]!.id,
          ownerId: user.userId,

        }))

        await db.insert(folders_table).values(insertableFolders)



      }}
    >
      <button type="submit">Seed</button>
    </form>
  </div>
  )
}
