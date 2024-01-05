import useAuthCheck from "@/hooks/useAuthCheck";
import { type ReactNode } from "react";

type ProtectedComponentProps = {
  children: ReactNode;
};

const ProtectedComponent = ({ children }: ProtectedComponentProps) => {
  const authStatus = useAuthCheck();

  if (authStatus === "loading") {
    return <div>Loading...</div>; // Or any loading indicator
  }

  if (authStatus === "unauthenticated") {
    return (
      <div>
        <h1>403 - Forbidden</h1>
        <p>You do not have permission to access this page.</p>
        {/* Additional styling or information */}
      </div>
    );
  }

  return children;
};

export default ProtectedComponent;
