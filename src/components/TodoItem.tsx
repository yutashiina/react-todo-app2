import React, { useState } from "react";
import type { Todo } from "../types";

type Props = {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, text: string, dueDate?: string) => void;
};

const TodoItem: React.FC<Props> = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(todo.text);
  const [dueDate, setDueDate] = useState(todo.dueDate || "");

  const handleSave = () => {
    onEdit(todo.id, text, dueDate || undefined);
    setIsEditing(false);
  };

  const color = todo.completed ? "#888" : todo.isDueSoon ? "red" : "black";

  return (
    <li style={{ margin: "0.5rem 0", color }}>
      <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)} />
      {isEditing ? (
        <>
          <input value={text} onChange={e => setText(e.target.value)} />
          <input type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          <button onClick={handleSave}>保存</button>
        </>
      ) : (
        <>
          <span style={{ marginLeft: "0.5rem" }}>{todo.text}</span>
          {todo.dueDate && (
            <span style={{ marginLeft: "0.5rem", color }}>
              (期限: {new Date(todo.dueDate).toLocaleString()})
            </span>
          )}
          <button onClick={() => setIsEditing(true)} style={{ marginLeft: "0.5rem" }}>編集</button>
          <button onClick={() => onDelete(todo.id)} style={{ marginLeft: "1rem" }}>削除</button>
        </>
      )}
    </li>
  );
};

export default TodoItem;
