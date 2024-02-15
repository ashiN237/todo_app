import { useState, useEffect } from "react";
import "./ToDoList.css";
import axios from "axios";

function ToDoList() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [notStartedTasks, setNotStartedTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [todo, setTodo] = useState("");

  // タスク一覧の取得
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/tasks")
      .then((response) => {
        const allTasks = response.data;
        const completed = [];
        const inProgress = [];
        const notStarted = [];

        allTasks.forEach((task) => {
          if (task.Status === 2) {
            completed.push(task);
          } else if (task.Status === 1) {
            inProgress.push(task);
          } else if (task.Status === 0) {
            notStarted.push(task);
          }
        });

        setCompletedTasks(completed);
        setInProgressTasks(inProgress);
        setNotStartedTasks(notStarted);
        setTasks(allTasks);
      })
      .catch((error) => {
        console.error("Failed to get tasks", error);
      });
  }, []);

  // タスクの追加
  const handlePush = () => {
    if (todo !== "") {
      axios
        .post("http://localhost:8000/api/tasks", { name: todo, status: 0 }) 
        .then((response) => {
          setNotStartedTasks(notStartedTasks.concat(response.data));
          setTodo("");
        })
        .catch((error) => {
          console.error("Failed to add task", error);
        });
    }
  };

  // タスクの完了
  const handleComplete = (index) => {
    const taskID = inProgressTasks[index].ID;
    axios
      .put(`http://localhost:8000/api/tasks/${taskID}`, { status: 2 })
      .then(() => {
        const task = inProgressTasks[index];
        setCompletedTasks(completedTasks.concat(task)); 
        setInProgressTasks(inProgressTasks.slice(0, index).concat(inProgressTasks.slice(index + 1)));
      })
      .catch((error) => {
        console.error("Failed to complete task", error);
      });
  };

  // タスクの削除
  const handleDelete = (index, status) => {
    const taskID = status === "completed" ? completedTasks[index].ID : status === "inProgress" ? inProgressTasks[index].ID : notStartedTasks[index].ID;
    axios
      .delete(`http://localhost:8000/api/tasks/${taskID}`)
      .then(() => {
        if (status === "completed") {
          setCompletedTasks(completedTasks.slice(0, index).concat(completedTasks.slice(index + 1)));
        } else if (status === "inProgress") {
          setInProgressTasks(inProgressTasks.slice(0, index).concat(inProgressTasks.slice(index + 1)));
        } else {
          setNotStartedTasks(notStartedTasks.slice(0, index).concat(notStartedTasks.slice(index + 1)));
        }
      })
      .catch((error) => {
        console.error("Failed to delete task", error);
      });
  };

  // タスクを進行中に変更
  const handleStart = (index) => {
    const taskID = notStartedTasks[index].ID;
    axios
      .put(`http://localhost:8000/api/tasks/${taskID}`, { status: 1 })
      .then(() => {
        const task = notStartedTasks[index];
        setInProgressTasks(inProgressTasks.concat(task));
        setNotStartedTasks(notStartedTasks.slice(0, index).concat(notStartedTasks.slice(index + 1)));
      })
      .catch((error) => {
        console.error("Failed to start task", error);
      });
};

  return (
    <div className="todoList">
      <h1 className="title">ToDoリスト</h1>
      <input value={todo} onChange={(e) => setTodo(e.target.value)} />
      <button onClick={handlePush} className="button">
        追加
      </button>
      <h2>タスク一覧</h2>
      <h3 className="subtitle">完了</h3>
      <ul className={`ul completed-list`}>
        {completedTasks.map((task, index) => (
          <li key={index} className="li">
            {task.Name}
            <button onClick={() => handleDelete(index, "completed")} className="button">
              削除
            </button>
          </li>
        ))}
      </ul>

      <h3 className="subtitle">進行中</h3>
      <ul className="ul">
        {inProgressTasks.map((task, index) => (
          <li key={index} className="li">
            {task.Name}
            <button onClick={() => handleComplete(index)} className="button">
              完了
            </button>
            <button onClick={() => handleDelete(index, "inProgress")} className="button">
              削除
            </button>
          </li>
        ))}
      </ul>

      <h3 className="subtitle">未着手</h3>
      <ul className="ul">
        {notStartedTasks.map((task, index) => (
          <li key={index} className="li">
            {task.Name}
            <button onClick={() => handleStart(index)} className="button">
              進行中に変更
            </button>
            <button onClick={() => handleDelete(index, "notStarted")} className="button">
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ToDoList;
