import { QUERIES } from "~/server/db/queries";
import DocumentsPage from "./DocumentsPage/page";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DB_DocumentType } from "~/server/db/schema";

export default async function Documents() {


  const user = await auth();
  if (!user.userId) {
    redirect('/sign-in');
  }

  const [documentFolders, documents] = await Promise.all([
    QUERIES.getDocumentFolders(user.userId),
    QUERIES.getDocuments(user.userId),
  ]);
  console.log(documents)
  console.log(documentFolders)

  return <DocumentsPage documents={documents as DB_DocumentType[]} documentFolders={documentFolders} userId={user.userId} />

}
