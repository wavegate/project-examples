import AppLayout from "@/components/layout";
import { api, type RouterOutputs } from "@/utils/api";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Table, message } from "antd";
import dayjs from "dayjs";
import Head from "next/head";
import { useRouter } from "next/router";

type BugOutput = RouterOutputs["bug"]["getAll"];

const Bugs = () => {
  const { data: bugs } = api.bug.getAll.useQuery();

  const utils = api.useUtils();

  const deleteBug = api.bug.delete.useMutation({
    async onMutate(deletedBug) {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.bug.getAll.cancel();

      // Get the data from the queryCache
      const prevData = utils.bug.getAll.getData();

      // Optimistically update the data with our new bug
      utils.bug.getAll.setData(undefined, (old = []) =>
        old.filter((bug) => bug.id !== deletedBug.id),
      );

      // Return the previous data so we can revert if something goes wrong
      return { prevData };
    },
    onError(err, deletedBug, ctx) {
      // If the mutation fails, use the context-value from onMutate
      utils.bug.getAll.setData(undefined, ctx?.prevData);

      void message.error("An error occurred.");
    },
    onSettled() {
      // Sync with server once mutation has settled
      void utils.bug.getAll.invalidate();
    },
  });

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Severity",
      dataIndex: ["severity", "name"],
      key: "severity",
    },
    {
      title: "Priority",
      dataIndex: ["priority", "name"],
      key: "priority",
    },
    {
      title: "Status",
      dataIndex: ["status", "name"],
      key: "status",
    },
    {
      title: "Created At",
      key: "createdAt",
      dataIndex: "createdAt",
      render: (_: unknown, record: BugOutput[number]) =>
        dayjs(record.createdAt).format("MM/DD/YYYY"),
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: BugOutput[number]) => (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            deleteBug.mutate({ id: record.id });
          }}
          style={{ cursor: "pointer" }}
        >
          <DeleteOutlined style={{ color: "red" }} />
        </Button>
      ),
    },
  ];

  const router = useRouter();

  return (
    <>
      <Head>
        <title>Bugs</title>
      </Head>
      <AppLayout>
        <div className={`mb-[24px] flex justify-between`}>
          <h1>Bugs</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => router.push("/bugs/create")}
          >
            Create Bug
          </Button>
        </div>
        <Table
          rowKey="id"
          dataSource={bugs}
          columns={columns}
          onRow={(record) => ({
            onClick: () => {
              void router.push(`/bugs/${record.id}`); // Navigate to the bug detail page
            },
          })}
          rowClassName="clickable-row"
        />
        ;
      </AppLayout>
    </>
  );
};

export default Bugs;
