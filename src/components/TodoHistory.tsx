import React from "react";
import type { Todo } from "../types";

interface TodoHistoryProps {
  todos: Todo[];
  onDelete: (id: number) => void;
}

const TodoHistory: React.FC<TodoHistoryProps> = ({ todos, onDelete }) => {
  const completedTodos = todos.filter(todo => todo.completed);

  if (completedTodos.length === 0) return null;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>完了済み履歴</h2>
      <ul>
        {completedTodos.map(todo => (
          <li key={todo.id} style={{ margin: "0.3rem 0" }}>
            <span style={{ textDecoration: "line-through", marginRight: "0.5rem" }}>
              {todo.text}
            </span>
            {todo.completedAt && (
              <span style={{ color: "#888", marginRight: "0.5rem" }}>
                ({new Date(todo.completedAt).toLocaleString()})
              </span>
            )}
            <button onClick={() => onDelete(todo.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoHistory;