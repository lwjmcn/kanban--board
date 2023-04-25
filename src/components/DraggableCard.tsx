import React, { useRef, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "../atom";

const Card = styled.div<{ isDragging: boolean }>`
  background-color: ${(props) =>
    props.isDragging ? props.theme.bgColor : props.theme.boxColor};
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 15px rgba(0,0,0,0.6)" : null};
  width: 100%;
  min-height: 40px;
  padding: 10px 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  display: flex;
`;
const Text = styled.div`
  flex-grow: 1;
  padding: 0 5px;
  overflow-x: auto;
  white-space: nowrap;
  text-overflow: ellipsis;
  ::-webkit-scrollbar {
    display: none;
  }
`;
const PopUp = styled.div`
  position: absolute;
  margin-top: 30px;
  margin-left: 40px;
  max-width: 200px;
  height: auto;
  background-color: ${(props) => props.theme.boxColor};
  color: ${(props) => props.theme.grayTextColor};
  border-color: ${(props) => props.theme.grayTextColor};
  border: 1px solid;
  border-radius: 5px;
  padding: 5px;
  font-size: 12px;
`;

interface IDraggableCardProps {
  boardId: string;
  toDoId: number;
  toDo: string;
  index: number;
}

function DraggableCard({ boardId, toDoId, toDo, index }: IDraggableCardProps) {
  // console.log(index);
  const setToDos = useSetRecoilState(toDoState);
  const textElementRef = useRef<any>(null);
  const [hover, setHover] = useState(false);
  const onDelete = () => {
    setToDos((prev) => {
      const targetBoardIndex = prev.findIndex(
        (board) => board.text === boardId
      );
      const copyBoard = { ...prev[targetBoardIndex] };
      const targetToDoIndex = copyBoard.toDos.findIndex(
        (toDo) => toDo.id === toDoId
      );
      copyBoard.toDos.splice(targetToDoIndex, 1);
      return [
        ...prev.slice(0, targetBoardIndex),
        copyBoard,
        ...prev.slice(targetBoardIndex + 1),
      ];
    });
  };
  const toggle = (e: React.MouseEvent) => {
    if (
      textElementRef.current.scrollWidth > textElementRef.current.clientWidth
    ) {
      setHover((prev) => !prev);
    }
  };

  return (
    <>
      {hover ? <PopUp>{toDo}</PopUp> : null}
      <Draggable key={toDoId} draggableId={toDoId + ""} index={index}>
        {(provided, snapshot) => (
          <Card
            isDragging={snapshot.isDragging}
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <span {...provided.dragHandleProps}>✅</span>
            <Text
              ref={textElementRef}
              onMouseEnter={toggle}
              onMouseLeave={toggle}
            >
              {toDo}
            </Text>
            <span onClick={onDelete} style={{ float: "right" }}>
              ✖
            </span>
          </Card>
        )}
      </Draggable>
    </>
  );
}

export default React.memo(DraggableCard); //props가 변하지 않았다면 재렌더링 X
