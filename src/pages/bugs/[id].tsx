// Adjust the import path as needed
import CustomComment from "@/components/Comment";
import AppLayout from "@/components/layout";
import { type RouterOutputs, api, RouterInputs } from "@/utils/api";
import { Button, Form, Input, List } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

type BugOutput = NonNullable<RouterOutputs["bug"]["getById"]>;
type EstimatedTimeType = BugOutput["estimatedTime"];
type CommentInput = RouterInputs["comment"]["create"];

const formatEstimatedTime = (estimatedTime: EstimatedTimeType): string => {
  if (!estimatedTime) {
    return "";
  }

  const parts: string[] = [];
  if (estimatedTime.weeks != null) {
    parts.push(`${estimatedTime.weeks} weeks`);
  }
  if (estimatedTime.days != null) {
    parts.push(`${estimatedTime.days} days`);
  }
  if (estimatedTime.hours != null) {
    parts.push(`${estimatedTime.hours} hours`);
  }
  if (estimatedTime.minutes != null) {
    parts.push(`${estimatedTime.minutes} minutes`);
  }

  return parts.join(", ");
};

const BugPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const {
    data: bug,
    isLoading,
    error,
  } = api.bug.getById.useQuery({ id: Number(id) }, { enabled: !!id });

  const [form] = Form.useForm<CommentInput>();

  const createComment = api.comment.create.useMutation({
    async onMutate(newBug) {
      // // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      // await utils.bug.getAll.cancel();
      // // Get the data from the queryCache
      // const prevData = utils.bug.getAll.getData();
      // // Optimistically update the data with our new bug
      // utils.bug.getAll.setData(undefined, (old = []) => [
      //   ...old,
      //   {
      //     ...newBug,
      //     id: Math.floor(Math.random() * 10000),
      //   } as BugOutput[number],
      // ]);
      // // Return the previous data so we can revert if something goes wrong
      // return { prevData };
    },
    onError(err, newBug, ctx) {
      // // If the mutation fails, use the context-value from onMutate
      // utils.bug.getAll.setData(undefined, ctx?.prevData);
      // void message.error("An error occurred.");
    },
    onSettled() {
      // // Sync with server once mutation has settled
      // void utils.bug.getAll.invalidate();
    },
  });

  const { data: sessionData } = useSession();

  const onFinish = (values: CommentInput) => {
    if (id && sessionData?.user && typeof id === "string") {
      // Handle the form submission
      createComment.mutate({
        ...values,
        bugId: Number(id),
        authorId: sessionData?.user.id,
      });
      // Reset the form fields after submission
      form.resetFields();
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!bug) return <div>No bug found</div>;

  const comments = bug.comments;
  const topLevelComments = comments.filter((comment) => !comment.parentId);

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
            return (
              <Link href={`/bugs/${dependency.id}`} key={dependency.id}>
                {dependency.title}
              </Link>
            );
          })}
        </p>
        <p>Estimated time: {formatEstimatedTime(bug.estimatedTime)}</p>
        <p>Actual time: {formatEstimatedTime(bug.actualTime)}</p>
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            name="content"
            rules={[{ required: true, message: "Please input your comment!" }]}
          >
            <Input.TextArea rows={4} placeholder="Write a comment..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Post Comment
            </Button>
          </Form.Item>
        </Form>
        <List
          dataSource={topLevelComments}
          renderItem={(comment) => (
            <List.Item>
              <CustomComment comment={comment} allComments={comments} />
            </List.Item>
          )}
        />
      </AppLayout>
    </>
  );
};

export default BugPage;
