import React, { useState } from "react";

interface TodoInputProps {
  onAdd: (text: string, dueDate?: string) => void;
}

const TodoInput: React.FC<TodoInputProps> = ({ onAdd }) => {
  const [inputValue, setInputValue] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    onAdd(inputValue, dueDate || undefined);
    setInputValue("");
    setDueDate("");
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="新しいToDoを入力"
      />
      <input
        type="datetime-local"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        style={{ marginLeft: "0.5rem" }}
      />
      <button onClick={handleAdd} style={{ marginLeft: "0.5rem" }}>
        追加
      </button>
    </div>
  );
};

export default TodoInput;
