import React, { useState, useEffect } from "react";
import type { Todo } from "./types";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import TodoHistoryByDate from "./components/TodoHistoryByDate";

const LOCAL_STORAGE_KEY = "my_todo_app";

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [dueAlerts, setDueAlerts] = useState<Todo[]>([]);

  // localStorageからロード
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  // ページ開いた時＆1分ごとに期限チェック
  useEffect(() => {
    const checkDueSoon = () => {
      setTodos(prevTodos => {
        const now = new Date();
        const newDueAlerts: Todo[] = [];

        const updatedTodos = prevTodos.map(todo => {
          if (!todo.completed && todo.dueDate) {
            const diff = new Date(todo.dueDate).getTime() - now.getTime();

            if (diff <= 10 * 60 * 1000) {
              if (!todo.alerted) newDueAlerts.push(todo);
              return { ...todo, isDueSoon: true, alerted: true };
            } else {
              return { ...todo, isDueSoon: false };
            }
          }
          return todo;
        });

        setDueAlerts(prev => {
          const ids = prev.map(t => t.id);
          const filteredNew = newDueAlerts.filter(t => !ids.includes(t.id));
          return [...prev, ...filteredNew];
        });

        const storageTodos = updatedTodos.map(({ isDueSoon, alerted, ...rest }) => rest);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storageTodos));

        return updatedTodos;
      });
    };

    checkDueSoon();
    const interval = setInterval(checkDueSoon, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const saveTodos = (newTodos: Todo[]) => {
    setTodos(newTodos);
    const storageTodos = newTodos.map(({ isDueSoon, alerted, ...rest }) => rest);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storageTodos));
  };

  const addTodo = (text: string, dueDate?: string, group?: string) => {
    const newTodo: Todo = { id: Date.now(), text, completed: false, dueDate, group };
    let updatedTodos = [...todos, newTodo];

    // 追加時に期限チェック
    const now = new Date();
    const newDueAlerts: Todo[] = [];
    if (dueDate) {
      const diff = new Date(dueDate).getTime() - now.getTime();
      if (diff <= 10 * 60 * 1000) {
        newTodo.isDueSoon = true;
        newTodo.alerted = true;
        newDueAlerts.push(newTodo);
      }
    }

    setTodos(updatedTodos);
    if (newDueAlerts.length > 0) setDueAlerts(prev => [...prev, ...newDueAlerts]);

    const storageTodos = updatedTodos.map(({ isDueSoon, alerted, ...rest }) => rest);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storageTodos));
  };

  // チェック時・未チェック時のアラート同期
  const toggleTodo = (id: number) => {
    setTodos(prevTodos => {
      const now = new Date();
      const newTodos = prevTodos.map(todo => {
        if (todo.id === id) {
          const updated = {
            ...todo,
            completed: !todo.completed,
            completedAt: !todo.completed ? new Date().toISOString() : undefined
          };

          if (updated.completed) {
            // 完了したらアラート削除
            setDueAlerts(prev => prev.filter(a => a.id !== id));
          } else {
            // チェックを外した場合、期限が近ければアラート再表示
            if (updated.dueDate) {
              const diff = new Date(updated.dueDate).getTime() - now.getTime();
              if (diff <= 10 * 60 * 1000) {
                setDueAlerts(prev => {
                  if (!prev.some(a => a.id === id)) {
                    return [...prev, { ...updated, isDueSoon: true, alerted: true }];
                  }
                  return prev;
                });
              }
            }
          }

          return updated;
        }
        return todo;
      });

      const storageTodos = newTodos.map(({ isDueSoon, alerted, ...rest }) => rest);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storageTodos));

      return newTodos;
    });
  };

  const deleteTodo = (id: number) => {
    saveTodos(todos.filter(todo => todo.id !== id));
    setDueAlerts(prev => prev.filter(todo => todo.id !== id));
  };

  const editTodo = (id: number, text: string, dueDate?: string) => {
    const newTodos = todos.map(todo =>
      todo.id === id ? { ...todo, text, dueDate } : todo
    );
    saveTodos(newTodos);
  };

  const deleteHistory = (id: number) => {
    saveTodos(todos.filter(todo => todo.id !== id));
    setDueAlerts(prev => prev.filter(todo => todo.id !== id));
  };

  const deleteGroup = (groupName: string) => {
    const remaining = todos.filter(todo => (todo.group || "未分類") !== groupName);
    saveTodos(remaining);
    setDueAlerts(prev => prev.filter(todo => (todo.group || "未分類") !== groupName));
  };

  const closeAlert = (id: number) => {
    setDueAlerts(prev => prev.filter(todo => todo.id !== id));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>ToDoリスト</h1>
      <TodoInput onAdd={addTodo} />
      <TodoList
        todos={todos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onEdit={editTodo}
        onDeleteGroup={deleteGroup}
      />
      <TodoHistoryByDate todos={todos} onDelete={deleteHistory} />

      {/* ページ内アラート */}
      <div style={{ position: "fixed", top: 10, right: 10, zIndex: 1000 }}>
        {dueAlerts.map(todo => (
          <div
            key={todo.id}
            style={{
              backgroundColor: "#fdd",
              color: "red",
              border: "1px solid red",
              padding: "0.5rem",
              marginBottom: "0.5rem",
              borderRadius: "4px"
            }}
          >
            期限が近いまたは過ぎているタスク: {todo.text}
            <button
              style={{ marginLeft: "0.5rem" }}
              onClick={() => closeAlert(todo.id)}
            >
              閉じる
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
