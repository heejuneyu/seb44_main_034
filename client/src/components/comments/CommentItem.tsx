import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
// import { PostComment } from "../../types/type";
import { PostComments } from "../../types/type";
import { baseURL } from "../../common/baseURL";
// import Replies from "./Replies";
import { styled } from "styled-components";
import { COLOR_1 } from "../../common/common";

type CommentItemProps = {
  comment: PostComments;
  // currentPosts: PostComments[];
};
type InputData = {
  content: string;
};

type EditComment = {
  content: string;
};

const S = {
  EditForm: styled.form`
    height: 140px;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    > input {
      width: 80%;
      min-height: 80px;
      min-width: 200px;
    }
    > button {
      margin-left: 8px;
      width: 18%;
      height: 30px;
      min-width: 70px;
      border-radius: 4px;
      border: 1px solid ${COLOR_1.dark_brown};
      background-color: ${COLOR_1.white};
      &:hover {
        cursor: pointer;
        background-color: ${COLOR_1.green};
      }
    }
  `,
  Comments: styled.div`
    display: block;
    width: 96%;
    min-height: 40px;
    padding: 4px;
  `,
  FlexWrap: styled.div`
    display: flex;
    justify-content: space-between;
    margin: 12px;
  `,
  Author: styled.div`
    display: flex;
    > span {
      font-size: 14px;
      &:hover {
        cursor: pointer;
      }
    }
  `,
  Edit: styled.div`
    display: flex;
    > span {
      margin-right: 12px;
      font-size: 12px;
      &:hover {
        cursor: pointer;
      }
    }
  `,
  Content: styled.div`
    font-size: 14px;
  `,
};

const CommentItem = ({ comment }: CommentItemProps) => {
  const [editing, setEditing] = useState(false);
  // const [editedText, setEditedText] = useState(comment.content);

  const {
    register,
    handleSubmit,
    reset,
    // formState: { errors }
  } = useForm<InputData>();

  const showEditComment = () => {
    //수정 창 보여주기
    setEditing(true);
  };

  const editComment = (editedContent: EditComment) =>
    axios.patch(
      `${baseURL}/post-comments/${comment.commentId}`,
      editedContent,
      {
        headers: { Authorization: localStorage.getItem("access_token") },
      }
    );
  const editCommentMutation = useMutation({
    mutationFn: editComment,
    onSuccess: (data, context) => {
      console.log(context);
      console.log(data);
      console.log(comment.commentId);
      reset();
    },
  });

  const deleteCommentMutation = useMutation(() => {
    return axios
      .delete(`${baseURL}/post-comments/${comment.commentId}`, {
        headers: {
          Authorization: localStorage.getItem("access_token"),
        },
      })
      .then((res) => {
        console.log(res);
        alert("삭제되었습니다.");
      });
  });

  const deleteComment = () => {
    if (
      confirm("삭제하신 댓글은 복구되지 않습니다. 정말로 삭제하시겠습니까?")
    ) {
      deleteCommentMutation.mutate();
    }
  };
  const onSubmitEdit = (editedContent: InputData) => {
    const comment = { ...editedContent };
    console.log(comment);
    editCommentMutation.mutate(comment);
  };

  return (
    <div>
      {editing ? (
        <ul>
          {
            <li key={comment.commentId}>
              <S.FlexWrap>
                <S.Author>
                  <span>{comment.author}</span>
                </S.Author>
                <S.Edit>
                  <span
                    onClick={() => {
                      showEditComment();
                    }}
                  >
                    수정
                  </span>
                  <span
                    onClick={() => {
                      deleteComment();
                    }}
                  >
                    삭제
                  </span>
                </S.Edit>
              </S.FlexWrap>
              {comment.content}
              <S.EditForm
                onSubmit={handleSubmit(onSubmitEdit)}
                // className={comment.commentId ? "active" : ""}
              >
                <input
                  type='text'
                  {...register("content", { required: true })}
                />
                <button
                  type='submit'
                  onClick={() => {
                    setEditing(false);
                  }}
                >
                  댓글 수정
                </button>
              </S.EditForm>
              {/* <Replies
                replies={comment?.replies}
                commentId={comment?.commentId}
              /> */}
            </li>
          }
        </ul>
      ) : (
        <S.Comments>
          <ul>
            <li key={comment.commentId}>
              <S.FlexWrap>
                <S.Author>
                  <span>{comment.author}</span>
                </S.Author>
                <S.Edit>
                  <span
                    onClick={() => {
                      showEditComment();
                    }}
                  >
                    수정
                  </span>
                  <span
                    onClick={() => {
                      deleteComment();
                    }}
                  >
                    삭제
                  </span>
                </S.Edit>
              </S.FlexWrap>
              {comment.content}
            </li>
          </ul>
        </S.Comments>
      )}
    </div>
  );
};

export default CommentItem;
