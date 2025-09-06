import React, { useState } from "react";
import type { TodoInputProps } from "../types";

const TodoInput: React.FC<TodoInputProps> = ({ onAdd, groups = [] }) => {
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState<string>();
  const [selectedGroup, setSelectedGroup] = useState<string>("");

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(text, dueDate, selectedGroup || undefined);
    setText("");
    setDueDate(undefined);
    setSelectedGroup("");
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <input
        type="text"
        placeholder="タスク名"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <input
        type="date"
        value={dueDate || ""}
        onChange={e => setDueDate(e.target.value)}
      />
      <select value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)}>
        <option value="">未分類</option>
        {groups.map(group => (
          <option key={group} value={group}>{group}</option>
        ))}
      </select>
      <button onClick={handleAdd}>追加</button>
    </div>
  );
};

export default TodoInput;
