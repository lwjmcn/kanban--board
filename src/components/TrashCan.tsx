import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: ${(props) => props.theme.accentColor};
`;

function TrashCan() {
  return (
    <Wrapper>
      <Droppable droppableId="trash">
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {snapshot.isDraggingOver ? (
              <FontAwesomeIcon icon={faTrashCan} beatFade size="5x" />
            ) : (
              <FontAwesomeIcon icon={faTrashCan} size="3x" color="#b1b8c0" />
            )}
            {/* {provided.placeholder} */}
          </div>
        )}
      </Droppable>
    </Wrapper>
  );
}
export default TrashCan;
