import { Helmet } from "react-helmet-async";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { IToDoState, toDoState } from "../atom";
import Board from "../components/Board";
import TrashCan from "../components/TrashCan";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { MasonryGrid } from "@egjs/react-grid";

const Title = styled.div`
  margin-top: 20px;
  padding: 20px 0px;
  font-weight: 600;
  font-size: 50px;
  text-align: center;
  color: ${(props) => props.theme.bgColor};
  border-top: 5px solid ${(props) => props.theme.bgColor};
  border-bottom: 5px solid ${(props) => props.theme.bgColor};
  border-color: ${(props) => props.theme.bgColor};
`;
const Wrapper = styled.div`
  max-width: 1000px;
  width: 100%;
  padding: 0px 20px;
  margin: 30px auto;
  align-items: start;
  min-height: 100vh;
  height: auto;
  /* overflow: hidden; */
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
`;
const Footer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
const AddBoard = styled.div`
  color: ${(props) => props.theme.grayTextColor};
  /* background-color: ${(props) => props.theme.bgColor}; */
  height: 49px;
  margin-top: auto;
  padding: 10px 15px;
  display: inline-flex;
  align-items: center;
  border: 3px solid ${(props) => props.theme.grayTextColor};
  border-radius: 10px;
  span {
    font-size: 20px;
    font-weight: 600;
    margin-left: 10px;
  }
  :hover {
    color: ${(props) => props.theme.accentColor};
    border: 3px solid ${(props) => props.theme.accentColor};
  }
`;

function ToDoList() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = ({ source, destination, type }: DropResult) => {
    if (!destination) return; //같은 자리 그대로
    if (type === "column") {
      // 보드 옮기기
      setToDos((prev) => {
        const copy = [...prev];
        const target = copy.splice(source.index, 1)[0];
        copy.splice(destination.index, 0, target);
        return copy;
      });
    } else if (destination.droppableId === "trash") {
      // 카드 버리기
      setToDos((prev) => {
        const targetBoardIndex = prev.findIndex(
          (board) => board.text === source.droppableId
        );
        const copyBoard = { ...prev[targetBoardIndex] };
        const targetToDoIndex = copyBoard.toDos.findIndex(
          (toDo) => toDo.id === source.index
        );
        copyBoard.toDos.splice(targetToDoIndex, 1);
        return [
          ...prev.slice(0, targetBoardIndex),
          copyBoard,
          ...prev.slice(targetBoardIndex + 1),
        ];
      });
    } else if (source.droppableId === destination.droppableId) {
      // 보드 내에서 카드 옮기기
      setToDos((prev) => {
        const targetBoardIndex = prev.findIndex(
          (board) => board.text === source.droppableId
        );
        const copyBoard = { ...prev[targetBoardIndex] };
        const targetToDoSrcIndex = copyBoard.toDos.findIndex(
          (toDo) => toDo.id === source.index
        );
        const target = copyBoard.toDos.splice(targetToDoSrcIndex, 1)[0];
        const targetToDoDestIndex = copyBoard.toDos.findIndex(
          (toDo) => toDo.id === destination.index
        );
        copyBoard.toDos.splice(targetToDoDestIndex, 0, target);
        return [
          ...prev.slice(0, targetBoardIndex),
          copyBoard,
          ...prev.slice(targetBoardIndex + 1),
        ];
      });
    } else {
      // 보드 간 카드 옮기기
      setToDos((prev) => {
        const targetBoardSrcIndex = prev.findIndex(
          (board) => board.text === source.droppableId
        );
        const targetBoardDestIndex = prev.findIndex(
          (board) => board.text === destination.droppableId
        );
        const copyBoardSrc = { ...prev[targetBoardSrcIndex] };
        const copyBoardDest = { ...prev[targetBoardDestIndex] };

        const targetToDoSrcIndex = copyBoardSrc.toDos.findIndex(
          (toDo) => toDo.id === source.index
        );
        const target = copyBoardSrc.toDos.splice(targetToDoSrcIndex, 1)[0];
        const targetToDoDestIndex = copyBoardDest.toDos.findIndex(
          (toDo) => toDo.id === destination.index
        );
        copyBoardDest.toDos.splice(targetToDoDestIndex, 0, target);
        if (targetBoardSrcIndex < targetBoardDestIndex)
          return [
            ...prev.slice(0, targetBoardSrcIndex),
            copyBoardSrc,
            ...prev.slice(targetBoardSrcIndex + 1, targetBoardDestIndex),
            copyBoardDest,
            ...prev.slice(targetBoardDestIndex + 1),
          ];
        else
          return [
            ...prev.slice(0, targetBoardDestIndex),
            copyBoardDest,
            ...prev.slice(targetBoardDestIndex + 1, targetBoardSrcIndex),
            copyBoardSrc,
            ...prev.slice(targetBoardSrcIndex + 1),
          ];
      });
    }
  };
  const onAddBoard = () => {
    setToDos((prev) => {
      const newBoard = { id: Date.now(), text: "none", toDos: [] };
      return [...prev, newBoard as unknown as IToDoState];
    });
  };
  return (
    <>
      <Helmet>
        <title>TODO</title>
      </Helmet>
      <Title>TO-DOs</Title>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable type="column" droppableId="boards">
          {(provided, snapshot) => (
            <Wrapper ref={provided.innerRef} {...provided.droppableProps}>
              {/* <MasonryGrid
                gap={15}
                defaultDirection={"end"}
                align={"stretch"}
                column={3}
                columnSize={0}
                columnSizeRatio={0}
              > */}
              {toDos.map((board, i) => (
                <Board
                  key={board.id}
                  index={i}
                  boardId={board.text}
                  toDos={board.toDos}
                />
              ))}
              {/* </MasonryGrid> */}
            </Wrapper>
          )}
        </Droppable>
        <Footer>
          <TrashCan />
          <AddBoard onClick={onAddBoard}>
            <FontAwesomeIcon icon={faAdd} size="xl" />
            <span>Add Board</span>
          </AddBoard>
        </Footer>
      </DragDropContext>
    </>
  );
}
export default ToDoList;
