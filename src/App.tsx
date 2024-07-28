import { useEffect, useState } from "react";
import axios from "axios";
import { type TodoItem } from "./types";
import dayjs from "dayjs";
import "./index.css";
// import { Route , Routes} from "react-router-dom";
import { Popover} from "flowbite-react";
import { Nav } from "./component/Nav";
import { Todo } from "./component/Todoitems";

function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState<"ADD" | "EDIT">("ADD");
  const [curTodoId, setCurTodoId] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [expandedTodoIds, setExpandedTodoIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [Description, setDescription] = useState("");

  async function fetchData() {
    const res = await axios.get<TodoItem[]>("api/todo");
    setTodos(res.data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputText(e.target.value);
  }
  function handleDescription(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setDescription(e.target.value);
  }

  function handleSubmit() {
    if (!inputText) return;
    if (mode === "ADD") {
      axios
        .request({
          url: "/api/todo",
          method: "put",
          data: { todoText: inputText, description: Description },
        })
        .then(() => {
          setInputText("");
          setDescription("");
          setShowPopup(false);
        })
        .then(fetchData)
        .catch((err) => alert(err));
    } else {
      axios
        .request({
          url: "/api/todo",
          method: "patch",
          data: { id: curTodoId, todoText: inputText },
        })
        .then(() => {
          setInputText("");
          setDescription("");
          setMode("ADD");
          setCurTodoId("");
          setShowPopup(false);
        })
        .then(fetchData)
        .catch((err) => alert(err));
    }
  }

  function handleDelete(id: string) {
    axios
      .delete("/api/todo", { data: { id } })
      .then(fetchData)
      .then(() => {
        setMode("ADD");
        setInputText("");
      })
      .catch((err) => alert(err));
  }

  // function handleCancel() {
  //   setMode("ADD");
  //   setInputText("");
  //   setCurTodoId("");
  //   setShowPopup(false);
  // }

  function handleAddClick() {
    setShowPopup(!showPopup);
    setMode("ADD");
    setInputText("");
    setDescription("");
  }

  // function handleEditClick() {
  //   setMode("EDIT");
  // }

  function handleSearchInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
  }

  // const filteredTodos = todos.filter((todo) =>
  //   todo.todoText.toLowerCase().includes(searchQuery.toLowerCase())
  //   ).map(item => {
  //   console.log(item , new Date());
  //   return item;
  //   }
  // )

  // function handleDoneClick() {
  //   console.log("a")

  // }

  function toggleAccordion(id: string) {
    if (expandedTodoIds.includes(id)) {
      setExpandedTodoIds(expandedTodoIds.filter((item) => item !== id));
    } else {
      setExpandedTodoIds([...expandedTodoIds, id]);
    }
  }

  const content = (
    <div className="max-w-lg mx-auto p-6 shadow-md">
      <div className="flex flex-col mb-4">
        <label className="text-white mb-2 ">Title</label>
        <input
          type="text"
          onChange={handleChange}
          value={inputText}
          data-cy="title-text"
          className=" backdrop-blur-xl bg-white/30 border border-gray-300 rounded-md py-2 px-3 text-sm leading-tight transition duration-150 ease-in-out w-full"
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-white mb-2 ">Description</label>
        <textarea
          name="des"
          onChange={handleDescription}
          value={Description}
          data-cy="description-text"
          className="backdrop-blur-xl bg-white/30 border border-gray-300 rounded-md py-2 px-3 text-sm leading-tight transition duration-150 ease-in-out w-full"
        
        />
      </div>
      <button
        onClick={handleSubmit}
        data-cy="submit"
        className="rounded-md w-full bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
      >
        Submit
      </button>
    </div>
  );

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-500">
      <Nav searchQuery={searchQuery} handleSearchInputChange={handleSearchInputChange}/>
      <div className="w-full ml-2 flex-1 pr-8">
      </div>
      <main style={{ minHeight: "100vh" }}>
        {todos.length === 0 && showPopup == false ? (
          <div className="empty-message text-center text-xl font-bold text-white ">
            Feel free to add anything to ToDue
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "start" }}>
            </div>
            <div data-cy="todo-item-wrapper" className="mb-5">
              {todos.filter((todo) => todo.todoText.toLowerCase().includes(searchQuery.toLowerCase())).sort(compareDate).map((item) => {
                return(
                <Todo key={item.id} item={item} formatDateTime={formatDateTime} expandedTodoIds={expandedTodoIds} toggleAccordion={toggleAccordion} handleDelete={handleDelete} fetchData={fetchData}/>
                );
              })}
            </div>
          </>
        )}
        <Popover content={content} trigger="click" placement="right" className="backdrop-blur-md bg-white/30 rounded-lg">
          <button
            onClick={handleAddClick}
            className="rounded-full h-12 w-12 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white fixed bottom-4 left-4 z-10 "
            data-cy="popup-button"
          >
            +
          </button>
        </Popover>
      </main>
    </div>
  );
}

export default App;

function formatDateTime(dateStr: string) {
  if (!dayjs(dateStr).isValid()) {
    return { date: "N/A", time: "N/A" };
  }
  const dt = dayjs(dateStr);
  const date = dt.format("D/MM/YYYY");
  const hours = dt.format("h");
  const minutes = dt.format("mm");
  const amPm = dt.format("A");

  return { date, time: `${hours}:${minutes} ${amPm}` };
}

function compareDate(a: TodoItem, b: TodoItem) {
  const da = dayjs(a.createdAt);
  const db = dayjs(b.createdAt);
  return da.isBefore(db) ? -1 : 1;
}