import { useState, useEffect } from "react";
const API_BASE = "http://localhost:3001";

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    getTodo();
  }, []);
  const getTodo = () => {
    fetch(API_BASE + "/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("error", err));
  };

  const completeTodo = async (id) => {
    const data = await fetch(API_BASE + "/todo/complete/" + id, {
      method: "PUT",
    }).then((res) => res.json());

    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }

        return todo;
      })
    );
  };
  async function deleteTodo(id) {
    const data = await fetch(API_BASE + "/todo/delete/" + id, {
      method: "delete",
    }).then((res) => res.json());
    setTodos((todos) => todos.filter((todo) => todo._id !== data._id));
  }
  const addtodo = async () => {
    const data = await fetch(API_BASE + "/todo/new", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        text: newTodo,
      }),
    }).then((res) => res.json());
    setTodos([...todos, data]);
    setPopupActive(false);
    setNewTodo("");
  };
  return (
    <div className="App">
      <h1>Welcome, Aiyus </h1>
      <h4> Your task</h4>
      <div className="todos">
        {todos.map((todo) => (
          <div
            className={"todo " + (todo.complete ? "is-complete" : "")}
            key={todo._id}
            onClick={() => completeTodo(todo._id)}
          >
            <div className="checkbox"></div>

            <div className="text">{todo.text}</div>

            <div
              className="delete-todo"
              onClick={(e) => {
                e.stopPropagation();
                deleteTodo(todo._id);
              }}
            >
              x
            </div>
          </div>
        ))}
      </div>
      <div className="addpopup" onClick={() => setPopupActive(true)}>
        +
      </div>
      {popupActive ? (
        <div className="popup">
          <div className="closepopup" onClick={() => setPopupActive(false)}>
            x
          </div>
          <div className="content">
            <h3>Add Tast</h3>
            <input
              type="text"
              className="add-to-input"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <button className="button" onClick={addtodo}>
              Create Task
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
