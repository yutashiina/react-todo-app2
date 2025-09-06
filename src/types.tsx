export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  completedAt?: string;
  dueDate?: string;
  group?: string;
  isDueSoon?: boolean;
  alerted?: boolean;
}

export interface TodoInputProps {
  onAdd: (text: string, dueDate?: string, group?: string) => void;
  groups?: string[];
}

export interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, text: string, dueDate?: string) => void;
  onDeleteGroup: (groupName: string) => void;
}

export interface TodoHistoryProps {
  todos: Todo[];
  onDelete: (id: number) => void;
}
