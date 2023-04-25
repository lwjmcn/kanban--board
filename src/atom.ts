import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

export interface IToDo {
  id: number;
  text: string;
}
export interface IToDoState {
  id: string;
  text: string;
  toDos: IToDo[];
}

const { persistAtom } = recoilPersist({
  key: "localToDo",
  storage: localStorage,
});

export const toDoState = atom<IToDoState[]>({
  key: "toDo",
  default: [
    { id: "0", text: "To Do", toDos: [{ id: 1, text: "hello" }] },
    { id: "1", text: "Doing", toDos: [] },
    { id: "2", text: "Done", toDos: [] },
  ],
  effects: [persistAtom],
});
export const boardNames = selector({
  key: "board",
  get: ({ get }) => {
    const toDos = get(toDoState);
    // const titles
    // toDos.
    return Object.keys(toDos);
  },
});
