import { type RouterOutputs } from "@/utils/api";
import { List, Card, Typography, Avatar } from "antd";
import dayjs from "dayjs";
const { Paragraph } = Typography;

type BugOutput = NonNullable<RouterOutputs["bug"]["getById"]>;
type CommentsType = BugOutput["comments"];
type SingleCommentType = CommentsType extends (infer T)[] ? T : never;

interface CustomCommentProps {
  comment: SingleCommentType;
  allComments: CommentsType;
}

const CustomComment = ({ comment, allComments }: CustomCommentProps) => {
  // Find replies to the current comment
  const replies = allComments.filter((c) => c.parentId === comment.id);

  return (
    <Card>
      <List.Item.Meta
        avatar={<Avatar>{comment.authorId.charAt(0).toUpperCase()}</Avatar>}
        title={comment.authorId}
        description={<Paragraph>{comment.content}</Paragraph>}
      />
      {dayjs(comment.createdAt).format("MM/DD/YYYY")}

      {replies.length > 0 && (
        <List
          dataSource={replies}
          renderItem={(reply) => (
            <List.Item>
              <CustomComment comment={reply} allComments={allComments} />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default CustomComment;
