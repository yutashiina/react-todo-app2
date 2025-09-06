import React, { useState } from "react";
import type { Todo } from "../types";

interface TodoHistoryByDateProps {
  todos: Todo[];
  onDelete: (id: number) => void;
}

const groupByDate = (todos: Todo[]) => {
  const groups: Record<string, Todo[]> = {};
  todos.forEach(todo => {
    if (!todo.completed || !todo.completedAt) return;
    const dateKey = todo.completedAt.split("T")[0];
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(todo);
  });
  return groups;
};

const TodoHistoryByDate: React.FC<TodoHistoryByDateProps> = ({ todos, onDelete }) => {
  const [descending, setDescending] = useState(true);
  const [collapsedDates, setCollapsedDates] = useState<Record<string, boolean>>({});
  const grouped = groupByDate(todos);
  const sortedDates = Object.keys(grouped).sort((a, b) =>
    descending ? (a < b ? 1 : -1) : (a > b ? 1 : -1)
  );

  if (sortedDates.length === 0) return null;

  const toggleCollapse = (date: string) => {
    setCollapsedDates(prev => ({ ...prev, [date]: !prev[date] }));
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>完了済み履歴（日付別）</h2>
      <button onClick={() => setDescending(!descending)} style={{ marginBottom: "1rem" }}>
        {descending ? "昇順に切替" : "降順に切替"}
      </button>
      {sortedDates.map(date => (
        <div key={date} style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "0.5rem", borderRadius: "5px", backgroundColor: "#f9f9f9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button onClick={() => toggleCollapse(date)} style={{ marginRight: "0.5rem" }}>
                {collapsedDates[date] ? "▶" : "▼"}
              </button>
              <h3 style={{ color: "#000" }}>{date}</h3>
            </div>
            <button onClick={() => grouped[date].forEach(todo => onDelete(todo.id))}>
              この日付の履歴を全削除
            </button>
          </div>
          {!collapsedDates[date] && (
            <ul style={{ marginTop: "0.5rem" }}>
              {grouped[date].map(todo => (
                <li key={todo.id} style={{ margin: "0.3rem 0", color: "#555", textDecoration: "line-through" }}>
                  <span style={{ textDecoration: "line-through", marginRight: "0.5rem", color: "#888" }}>
                    {todo.text}
                  </span>
                  <span style={{ color: "#555", marginRight: "0.5rem" }}>
                    [{todo.group || "未分類"}]
                  </span>
                  {/*{todo.dueDate && (
                    <span style={{ color: "#555", marginRight: "0.5rem" }}>
                      (期限: {new Date(todo.dueDate).toLocaleString()})
                    </span>
                  )}*/}
                  <button onClick={() => onDelete(todo.id)} style={{ marginLeft: "0.5rem" }}>
                    削除
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default TodoHistoryByDate;
