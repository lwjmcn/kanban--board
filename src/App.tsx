import { HelmetProvider } from "react-helmet-async";
import ToDoList from "./pages/ToDoList";

function App() {
  return (
    <>
      <HelmetProvider>
        <ToDoList />
      </HelmetProvider>
    </>
  );
}

export default App;
