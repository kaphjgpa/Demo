"use client";
import { Github } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  return (
    <div className="flex h-screen items-center justify-center bg-zinc-900">
      <div className="w-full max-w-sm bg-zinc-200 p-8 shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        <button
          onClick={async () => {
            await signIn("google", { callbackUrl: "/" });
          }}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
        >
          <img src="/google.svg" alt="google logo" height={20} width={20} />
          Sign in with Google
        </button>
        <div className="my-4 text-center text-gray-500">OR</div>
        <button
          onClick={async () => {
            await signIn("github", { callbackUrl: "/" });
          }}
          className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-900 transition"
        >
          <Github className="h-6 w-6" />
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}
