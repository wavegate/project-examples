import AppLayout from "@/components/layout";
import { type RouterInputs, api, type RouterOutputs } from "@/utils/api";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Form, Input, Table, message } from "antd";
import Head from "next/head";

type BugInput = RouterInputs["bug"]["create"];
type BugOutput = RouterOutputs["bug"]["getAll"];

const Bugs = () => {
  const { data: bugs } = api.bug.getAll.useQuery();
  const utils = api.useUtils();

  const createBug = api.bug.create.useMutation({
    async onMutate(newBug) {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.bug.getAll.cancel();

      // Get the data from the queryCache
      const prevData = utils.bug.getAll.getData();

      // Optimistically update the data with our new bug
      utils.bug.getAll.setData(undefined, (old = []) => [
        ...old,
        newBug as BugOutput[number],
      ]);

      // Return the previous data so we can revert if something goes wrong
      return { prevData };
    },
    onError(err, newBug, ctx) {
      // If the mutation fails, use the context-value from onMutate
      utils.bug.getAll.setData(undefined, ctx?.prevData);

      void message.error("An error occurred.");
    },
    onSettled() {
      // Sync with server once mutation has settled
      void utils.bug.getAll.invalidate();
    },
  });

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
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: BugOutput[number]) => (
        <DeleteOutlined
          onClick={() => deleteBug.mutate({ id: record.id })}
          style={{ color: "red", cursor: "pointer" }}
        />
      ),
    },
  ];

  const onFinish = (values: BugInput) => {
    createBug.mutate(values);
  };

  const [form] = Form.useForm<BugInput>();

  return (
    <>
      <Head>
        <title>Bugs</title>
      </Head>
      <AppLayout>
        <h1>Bugs</h1>
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input your title!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        <Table rowKey="id" dataSource={bugs} columns={columns} />;
      </AppLayout>
    </>
  );
};

export default Bugs;
