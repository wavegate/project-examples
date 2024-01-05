import { useSession } from "next-auth/react";

const useAuthCheck = () => {
  const { data: sessionData, status } = useSession();

  // Return 'loading', 'authenticated', or 'unauthenticated'
  if (status === "loading") {
    return "loading";
  }
  return sessionData?.user ? "authenticated" : "unauthenticated";
};

export default useAuthCheck;
