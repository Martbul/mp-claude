import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { QUERIES } from "~/server/db/queries";
import SettingsPage from "./settingsPage";

export default async function Notes() {

  const user = await auth();
  if (!user.userId) {
    redirect('/sign-in');
  }
  //TODO: GET SETTINGS
  //
  //TODO: GET PROFILE
  //


  const userSettings = await QUERIES.getUserSettings(user.userId);
  if (!userSettings) {
    throw new Error("User settings not found");
  }

  console.log(userSettings)


  return (
    <SettingsPage userId={user.userId} userSettings={userSettings}></SettingsPage>
  );
}




