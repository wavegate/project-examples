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
    <>
      <div>Hello!</div>
      <div>This is the home page of my prototype web applications.</div>
    </>
  );
}
