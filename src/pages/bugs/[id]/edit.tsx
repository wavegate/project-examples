import AppLayout from "@/components/layout";
import { api, type RouterOutputs, type RouterInputs } from "@/utils/api";
import { Form, InputNumber, message, Select, Button, Input } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

type BugInput = RouterInputs["bug"]["update"];

type BugOutput = RouterOutputs["bug"]["getAll"];

interface TimeInputProps {
  label: string;
  name: string; // This will be used as the base name for the form fields
}

const TimeInput = ({ label, name }: TimeInputProps) => (
  <Form.Item label={label}>
    <Input.Group compact>
      <Form.Item name={[name, "weeks"]} noStyle>
        <InputNumber min={0} placeholder="Weeks" />
      </Form.Item>
      <Form.Item name={[name, "days"]} noStyle>
        <InputNumber min={0} placeholder="Days" />
      </Form.Item>
      <Form.Item name={[name, "hours"]} noStyle>
        <InputNumber min={0} max={23} placeholder="Hours" />
      </Form.Item>
      <Form.Item name={[name, "minutes"]} noStyle>
        <InputNumber min={0} max={59} placeholder="Minutes" />
      </Form.Item>
    </Input.Group>
  </Form.Item>
);

const CreateBug = () => {
  const router = useRouter();
  const { id } = router.query;
  const {
    data: bug,
    isLoading,
    error,
  } = api.bug.getById.useQuery({ id: Number(id) }, { enabled: !!id });

  const { data: bugs } = api.bug.getAll.useQuery();
  const { data: severities } = api.severity.getAll.useQuery();
  const { data: priorities } = api.priority.getAll.useQuery();
  const { data: statuses } = api.status.getAll.useQuery();
  const { data: users } = api.user.getAll.useQuery();
  const { data: environments } = api.environment.getAll.useQuery();
  const { data: sessionData } = useSession();

  const utils = api.useUtils();

  const editBug = api.bug.update.useMutation({
    async onMutate(newBug) {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.bug.getAll.cancel();

      // Get the data from the queryCache
      const prevData = utils.bug.getAll.getData();

      // Optimistically update the data with our new bug
      utils.bug.getAll.setData(undefined, (old = []) => [
        ...old,
        {
          ...newBug,
          id: Math.floor(Math.random() * 10000),
        } as BugOutput[number],
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

  const onFinish = (values: Omit<BugInput, "id">) => {
    editBug.mutate({ ...values, id: Number(id) });
  };

  const [form] = Form.useForm<BugInput>();

  useEffect(() => {
    if (bug) {
      form.resetFields();
      form.setFieldsValue({
        title: bug.title,
        description: bug.description ?? undefined,
        stepsToReproduce: bug.stepsToReproduce ?? undefined,
        environmentId: bug.environmentId ?? undefined,
        severityId: bug.severityId ?? undefined,
        priorityId: bug.priorityId ?? undefined,
        statusId: bug.statusId ?? undefined,
        assigneeId: bug.assigneeId ?? undefined,
        reporterId: bug.reporterId ?? undefined,
        estimatedTime: bug.estimatedTime
          ? {
              weeks: bug.estimatedTime.weeks ?? undefined,
              days: bug.estimatedTime.days ?? undefined,
              hours: bug.estimatedTime.hours ?? undefined,
              minutes: bug.estimatedTime.minutes ?? undefined,
            }
          : undefined,
        actualTime: bug.actualTime
          ? {
              weeks: bug.actualTime.weeks ?? undefined,
              days: bug.actualTime.days ?? undefined,
              hours: bug.actualTime.hours ?? undefined,
              minutes: bug.actualTime.minutes ?? undefined,
            }
          : undefined,
        dependenciesIds: bug.dependencies
          ? bug.dependencies.map((dependency) => dependency.id)
          : undefined,
      });
    }
  }, [form, bug]);

  return (
    <>
      <AppLayout>
        <h1 className={`mb-[24px]`}>Edit Bug</h1>
        <Form
          form={form}
          onFinish={onFinish}
          initialValues={{ id: bug?.id, description: bug?.description }}
        >
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
          <Form.Item label="Steps to Reproduce" name="stepsToReproduce">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="environmentId" label="Environment">
            <Select
              options={environments?.map((environment) => ({
                label: environment.name,
                value: environment.id, // or environment.name, depending on what you want to submit
              }))}
              placeholder="Select environment"
            />
          </Form.Item>

          <Form.Item name="severityId" label="Severity">
            <Select
              options={severities?.map((severity) => ({
                label: severity.name,
                value: severity.id, // or severity.name, depending on what you want to submit
              }))}
              placeholder="Select severity"
            />
          </Form.Item>
          <Form.Item name="priorityId" label="Priority">
            <Select
              options={priorities?.map((priority) => ({
                label: priority.name,
                value: priority.id, // or priority.name, depending on what you want to submit
              }))}
              placeholder="Select priority"
            />
          </Form.Item>
          <Form.Item name="statusId" label="Status">
            <Select
              options={statuses?.map((status) => ({
                label: status.name,
                value: status.id, // or status.name, depending on what you want to submit
              }))}
              placeholder="Select status"
            />
          </Form.Item>
          <Form.Item name="assigneeId" label="Assignee">
            <Select
              options={users?.map((user) => ({
                label: user.name,
                value: user.id, // or user.name, depending on what you want to submit
              }))}
              placeholder="Select assignee"
            />
          </Form.Item>
          <Form.Item name="reporterId" label="Reporter">
            <Select
              options={users?.map((user) => ({
                label: user.name,
                value: user.id, // or user.name, depending on what you want to submit
              }))}
              placeholder="Select reporter"
            />
          </Form.Item>
          <Form.Item name="dependenciesIds" label="Bug Dependencies">
            <Select
              mode="multiple"
              options={bugs?.map((bug) => ({
                label: bug.title,
                value: bug.id, // or bug.name, depending on what you want to submit
              }))}
              placeholder="Select bugs"
            />
          </Form.Item>

          <TimeInput label="Estimated Time" name="estimatedTime" />
          <TimeInput label="Actual Time" name="actualTime" />

          <Form.Item>
            <Button type="default" onClick={() => router.push("/bugs")}>
              Cancel
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </AppLayout>
    </>
  );
};

export default CreateBug;
