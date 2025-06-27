import { QUERIES } from "~/server/db/queries";
import DocumentsPage from "./DocumentsPage/page";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function MPClaude() {


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

  return <DocumentsPage documents={documents} documentFolders={documentFolders} userId={user.userId} />

}
