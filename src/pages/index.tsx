import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "@/utils/api";
import AppLayout from "@/components/layout";

export default function Home() {
  return (
    <>
      <AppLayout>
        <AuthShowcase />
      </AppLayout>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.post.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  const { data: latestMessage } = api.post.getLatest.useQuery();

  const createPost = api.post.create.useMutation();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        {sessionData && (
          <button
            onClick={
              sessionData
                ? () => createPost.mutate({ name: "Sally" })
                : () => {
                    return;
                  }
            }
          >
            Create post
          </button>
        )}
        {JSON.stringify(latestMessage)}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
    </div>
  );
}
