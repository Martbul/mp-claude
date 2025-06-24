import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';

export default async function SignInPage() {
  const user = await auth();
  if (user.userId) {
    redirect('/workspace');
  }

  return (
    <div className="flex min-h-screen flex-col justify-center items-center p-4">
      <SignInButton forceRedirectUrl={"/workspace"} />
      <footer className="mt-16 text-sm text-neutral-500">
        © {new Date().getFullYear()} T3 Drive. All rights reserved.
      </footer>
    </div>
  );
}
