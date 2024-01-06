// Adjust the import path as needed
import AppLayout from "@/components/layout";
import { api } from "@/utils/api";
import { Button } from "antd";
import { useRouter } from "next/router";

const BugPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const {
    data: bug,
    isLoading,
    error,
  } = api.bug.getById.useQuery({ id: Number(id) }, { enabled: !!id });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!bug) return <div>No bug found</div>;

  return (
    <>
      <AppLayout>
        <div className={`mb-[24px] flex items-center gap-[24px]`}>
          <h1>Bug Details</h1>
          <Button onClick={() => router.push(`/bugs/${bug.id}/edit`)}>
            Edit Bug
          </Button>
        </div>
        <p>Title: {bug.title}</p>
        <p>Description: {bug.description}</p>
        <p>Steps to reproduce: {bug.stepsToReproduce}</p>
        <p>Environment: {bug.environment?.name}</p>
        <p>Severity: {bug.severity?.name}</p>
        <p>Priority: {bug.priority?.name}</p>
        <p>Status: {bug.status?.name}</p>
        <p>Assignee: {bug.assignee?.name}</p>
        <p>Reporter: {bug.reporter?.name}</p>
        <p>
          Dependencies:{" "}
          {bug.dependencies?.map((dependency) => {
            return <div>Hi</div>;
          })}
        </p>
        <p>Estimated time: {bug.estimatedTime?.weeks}</p>
        <p>Actual time: {bug.actualTime?.weeks}</p>
      </AppLayout>
    </>
  );
};

export default BugPage;
