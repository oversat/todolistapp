import { useState, useEffect } from 'react';
import { useSound } from './useSound';
import { useNotifications } from './useNotifications';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
}

export function useTodo() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved).map((todo: any) => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
      dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
    })) : [];
  });

  const { playSound } = useSound();
  const { showNotification } = useNotifications();

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string, dueDate?: Date) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date(),
      dueDate,
    };
    setTodos((prev) => [...prev, newTodo]);
    playSound('complete');
    showNotification('New todo added', { body: text });
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
    playSound('complete');
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    playSound('delete');
  };

  const updateTodo = (id: string, text: string, dueDate?: Date) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, text, dueDate }
          : todo
      )
    );
  };

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
  };
} 