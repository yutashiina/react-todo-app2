import React from "react";
import type { TodoListProps } from "../types";
import TodoItem from "./TodoItem";

const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete, onEdit, onDeleteGroup }) => {
  // グループごとにまとめる
  const groups = Array.from(new Set(todos.map(todo => todo.group || "未分類")));

  return (
    <div>
      {groups.map(groupName => (
        <div key={groupName} style={{ marginBottom: "1rem" }}>
          <h3>
            {groupName}
            {onDeleteGroup && (
              <button
                onClick={() => onDeleteGroup(groupName)}
                style={{ marginLeft: "1rem" }}
              >
                グループ全削除
              </button>
            )}
          </h3>
          <ul>
            {todos
              .filter(todo => (todo.group || "未分類") === groupName)
              .map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TodoList;
