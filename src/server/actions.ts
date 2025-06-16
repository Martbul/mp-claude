"use server"

import { and, eq } from "drizzle-orm"
import { db } from "./db"
import { files_table } from "./db/schema"
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";

//when using use server every export becomes an endpoing
//alon with that a function can be used in the client
//


const utApi = new UTApi()

export async function deleteFile(fileId: number) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" }
  }
  const [file] = await db
    .select()
    .from(files_table)
    .where(and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId))) //and want every condition to be true in order to execute the db delete

  if (!file) {
    return { error: "File not found" }
  }

  const utapiResult = await utApi.deleteFiles([file.url.replace("https://utfs.io/f/", "")])

  console.log(utapiResult)
  const dbDeleteResult = await db.delete(files_table).where(eq(files_table.id, fileId))

  const c = await cookies()

  c.set("force-refresh", JSON.stringify(Math.random())) //by updating the cookis next will revalidate the page and update its contents(better way to refresh)

  console.log(dbDeleteResult)
  return { success: true }
}
