import { v4 as uuidv4 } from "uuid";

const initialData = [
  {
    id: uuidv4(),
    name: "In Progress",
    todos: [],
  },
  {
    id: uuidv4(),
    name: "Waiting for Others",
    todos: [],
  },
  {
    id: uuidv4(),
    name: "Not Yet Started",
    todos: [],
  },
  {
    id: uuidv4(),
    name: "Done",
    todos: [],
  },
];

export default initialData;
