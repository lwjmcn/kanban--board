import { Draggable, Droppable } from "react-beautiful-dnd";
import DraggableCard from "./DraggableCard";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { IToDo, IToDoState, boardNames, toDoState } from "../atom";
import { useRecoilValue, useSetRecoilState } from "recoil";

const Wrapper = styled.div<{ isDragging: boolean }>`
  background-color: ${(props) =>
    props.isDragging ? props.theme.grayTextColor : props.theme.bgColor};
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 15px rgba(0,0,0,0.6)" : null};
  /* max-width: 300px; */
  min-height: 300px;
  padding: 10px 0px;
  padding-top: 20px;
  border-radius: 5px;
  //Area 영역 확장
  display: flex;
  flex-direction: column;
`;
const Title = styled.div`
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 20px;
  text-align: center;
  color: ${(props) => props.theme.textColor};
`;
interface IAreaProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}
const Area = styled.div<IAreaProps>`
  padding: 10px;
  background-color: ${(props) =>
    props.isDraggingOver
      ? props.theme.accentColor
      : props.isDraggingFromThis
      ? props.theme.grayTextColor
      : props.theme.bgColor};
  flex-grow: 1; //Area 영역 확장
  transition: background-color 0.3s ease-in-out;
`;
const TitleForm = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  input {
    width: 90%;
    height: 30px;
    padding-left: 10px;
    border: none;
  }
`;
const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  input {
    width: 90%;
    height: 30px;
    padding-left: 10px;
    border: none;
  }
`;
const Error = styled.div`
  width: 90%;
  height: 30px;
  padding: 5px 15px;
  color: red;
  font-size: 13px;
`;
const Line = styled.hr`
  border: 2px dotted ${(props) => props.theme.grayTextColor};
  width: 90%;
`;

interface BoardProps {
  index: number;
  boardId: string;
  toDos: IToDo[];
}
interface IForm {
  toDo?: string;
  board?: string;
}

function Board({ index, boardId, toDos }: BoardProps) {
  const setToDo = useSetRecoilState(toDoState);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<IForm>();
  const boards = useRecoilValue(boardNames);
  const onValidToDo = (data: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: data.toDo!,
    };
    setToDo((prev) => {
      const newBoard = {
        id: index,
        text: boardId,
        toDos: [newToDo, ...prev[index].toDos],
      };
      return [
        ...prev.slice(0, index),
        newBoard as unknown as IToDoState,
        ...prev.slice(index + 1),
      ];
    });
    reset();
  };
  const onValidBoard = (data: IForm) => {
    if (data.board === "none") {
      setError("board", { message: "Invalid Name" }, { shouldFocus: true });
      return;
    }
    if (boards.includes(data.board!)) {
      setError("board", { message: "Invalid Name" }, { shouldFocus: true });
      return;
    }
    setToDo((prev) => {
      const newBoard = {
        id: index,
        text: data.board!,
        toDos: [],
      };
      return [...prev.slice(0, index), newBoard as unknown as IToDoState];
    });
  };
  return (
    <Draggable key={boardId} draggableId={boardId + ""} index={index}>
      {(provided, snapshot) => (
        <Wrapper
          isDragging={snapshot.isDragging}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          {boardId === "none" ? (
            <>
              <TitleForm onSubmit={handleSubmit(onValidBoard)}>
                <input
                  autoFocus={true}
                  placeholder="What's your new Board Name?"
                  {...register("board", {
                    required: "Required!",
                    maxLength: {
                      value: 10,
                      message: "Maximum length is 10 letters",
                    },
                  })}
                />
              </TitleForm>
              <Error>{errors.board ? `⚠${errors.board.message}` : null}</Error>
            </>
          ) : (
            <>
              <Title {...provided.dragHandleProps}>{boardId}</Title>
              <Form onSubmit={handleSubmit(onValidToDo)}>
                <input
                  type="text"
                  placeholder={`Add task on ${boardId}`}
                  {...register("toDo", {
                    required: "Required!",
                    maxLength: {
                      value: 30,
                      message: "Maximum length is 30 letters",
                    },
                  })}
                />
              </Form>
              <Error>{errors.toDo ? `⚠${errors.toDo.message}` : null}</Error>
            </>
          )}
          <Line />
          <Droppable droppableId={boardId}>
            {(provided, snapshot) => (
              <Area
                isDraggingOver={snapshot.isDraggingOver}
                isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {toDos.map((item, i) => (
                  <DraggableCard
                    key={item.id}
                    boardId={boardId}
                    toDoId={item.id}
                    toDo={item.text}
                    index={i}
                  />
                ))}
                {provided.placeholder}
              </Area>
            )}
          </Droppable>
        </Wrapper>
      )}
    </Draggable>
  );
}
export default Board;
