import { useState, useEffect } from 'react';
import { useSound } from './useSound';
import { useNotifications } from './useNotifications';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface Chibi {
  id: string;
  name: string;
  image: string;
  happiness: number;
  energy: number;
  tasks: Task[];
}

export function useChibi() {
  const [chibis, setChibis] = useState<Chibi[]>(() => {
    const saved = localStorage.getItem('chibis');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentChibiIndex, setCurrentChibiIndex] = useState(0);
  const { playSound } = useSound();
  const { showNotification } = useNotifications();

  useEffect(() => {
    localStorage.setItem('chibis', JSON.stringify(chibis));
  }, [chibis]);

  const currentChibi = chibis[currentChibiIndex];

  const createChibi = (name: string, image: string) => {
    const newChibi: Chibi = {
      id: Date.now().toString(),
      name,
      image,
      happiness: 100,
      energy: 100,
      tasks: [],
    };
    setChibis([...chibis, newChibi]);
    playSound('complete');
  };

  const addTask = (text: string) => {
    if (!currentChibi) return;

    const newTask: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
    };

    setChibis(chibis.map((chibi, index) =>
      index === currentChibiIndex
        ? { ...chibi, tasks: [...chibi.tasks, newTask] }
        : chibi
    ));
    playSound('complete');
  };

  const completeTask = (taskId: string) => {
    if (!currentChibi) return;

    setChibis(chibis.map((chibi, index) =>
      index === currentChibiIndex
        ? {
            ...chibi,
            tasks: chibi.tasks.map(task =>
              task.id === taskId ? { ...task, completed: true } : task
            ),
            happiness: Math.min(100, chibi.happiness + 10),
          }
        : chibi
    ));
    playSound('complete');
    showNotification('Task Completed!', { body: 'Feed your Chibi to keep them happy!' });
  };

  const deleteTask = (taskId: string) => {
    if (!currentChibi) return;

    setChibis(chibis.map((chibi, index) =>
      index === currentChibiIndex
        ? {
            ...chibi,
            tasks: chibi.tasks.filter(task => task.id !== taskId),
          }
        : chibi
    ));
    playSound('delete');
  };

  const editTask = (taskId: string, newText: string) => {
    if (!currentChibi) return;

    setChibis(chibis.map((chibi, index) =>
      index === currentChibiIndex
        ? {
            ...chibi,
            tasks: chibi.tasks.map(task =>
              task.id === taskId ? { ...task, text: newText } : task
            ),
          }
        : chibi
    ));
    playSound('complete');
  };

  const feedChibi = () => {
    if (!currentChibi) return;

    setChibis(chibis.map((chibi, index) =>
      index === currentChibiIndex
        ? {
            ...chibi,
            happiness: 100,
            energy: Math.min(100, chibi.energy + 20),
          }
        : chibi
    ));
    playSound('feed');
  };

  const cleanCompletedTasks = () => {
    if (!currentChibi) return;

    setChibis(chibis.map((chibi, index) =>
      index === currentChibiIndex
        ? {
            ...chibi,
            tasks: chibi.tasks.filter(task => !task.completed),
          }
        : chibi
    ));
    playSound('clean');
  };

  const resetData = () => {
    setChibis([]);
    setCurrentChibiIndex(0);
    playSound('delete');
  };

  return {
    chibis,
    currentChibi,
    setCurrentChibiIndex,
    createChibi,
    addTask,
    completeTask,
    deleteTask,
    editTask,
    feedChibi,
    cleanCompletedTasks,
    resetData,
  };
} 