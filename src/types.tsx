export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  completedAt?: string;  // 完了日時
  dueDate?: string;      // 期限
  isDueSoon?: boolean;   // 期限切れ／期限10分以内フラグ（state 内のみ）
  alerted?: boolean;     // アラート済みフラグ（state 内のみ）
  group?: string;        // グループ名
}

export type TodoListProps = {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, text: string, dueDate?: string) => void;
  onDeleteGroup?: (groupName: string) => void;
};
