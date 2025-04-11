import { useState } from 'react';

interface TaskInputProps {
  onAddTask: (text: string) => void;
}

export function TaskInput({ onAddTask }: TaskInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onAddTask(text.trim());
      setText('');
    }
  };

  return (
    <div className="flex gap-2 w-full">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        className="min-w-0 flex-1 px-3 py-2 bg-white border-2 border-[#000080] text-gray-800 font-vt323 text-lg rounded focus:outline-none"
        placeholder="Add a new task..."
      />
      <button
        onClick={handleSubmit}
        disabled={!text.trim()}
        className="whitespace-nowrap px-4 py-2 bg-[#c3c3c3] text-gray-800 font-vt323 border-2 border-t-white border-l-white border-r-gray-600 border-b-gray-600 hover:bg-[#d4d4d4] transition-colors disabled:opacity-50"
      >
        Add Task
      </button>
    </div>
  );
} 