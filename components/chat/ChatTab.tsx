import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatTabProps {
  chibiId: string;
  chibiName: string;
  chibiType: string;
  tasks: Array<{
    id: string;
    text: string;
    notes?: string;
    completed: boolean;
  }>;
}

export interface ChatTabHandle {
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const ChatTab = forwardRef<ChatTabHandle, ChatTabProps>(({ chibiId, chibiName, chibiType, tasks }, ref) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Load last 3 messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(`chat_history_${chibiId}`);
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages) as Message[];
      // Get last 3 messages and reverse their order
      const lastThreeMessages = parsedMessages.slice(-3).reverse();
      setMessages(lastThreeMessages);
    }
  }, [chibiId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const inputElement = (e.target as HTMLFormElement).querySelector('input[type="text"]') as HTMLInputElement;
    if (!inputElement?.value.trim() || isLoading) return;

    const userMessage = inputElement.value.trim();
    inputElement.value = '';
    setIsLoading(true);

    // Add user message to chat
    const newMessages: Message[] = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          chibiId,
          chibiName,
          chibiType,
          tasks,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const updatedMessages: Message[] = [...newMessages, { role: 'assistant' as const, content: data.message }];
      setMessages(updatedMessages);

      // Save messages to localStorage
      localStorage.setItem(`chat_history_${chibiId}`, JSON.stringify(updatedMessages));
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant' as const, content: "Sorry, I couldn't process your message." }]);
    } finally {
      setIsLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    handleSubmit
  }));

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "mb-4",
              message.role === 'user' ? 'text-right' : 'text-left'
            )}
          >
            <div
              className={cn(
                "inline-block max-w-[70%] p-3 rounded-lg",
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-left mb-4">
            <div className="inline-block max-w-[70%] p-3 rounded-lg bg-gray-200 text-gray-800">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce mr-1"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce mr-1" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
});

ChatTab.displayName = 'ChatTab';

export default ChatTab; 