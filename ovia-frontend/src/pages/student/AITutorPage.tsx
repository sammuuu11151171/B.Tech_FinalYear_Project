import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, BookOpen, HelpCircle } from 'lucide-react';
import { chatbotService } from '../../services/chatbotService';
import type { ChatMessage, SourceCitation } from '../../types';
import { TopBar } from '../../components/navigation/TopBar';
import { ChatMessageBubble } from '../../components/chatbot/ChatMessageBubble';
import { Button } from '../../components/common/Button';

export const AITutorPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      sender: 'tutor',
      message:
        "Hello! I am your OVIA AI Tutor. I can answer questions about Indian Sign Language alphabets (A-Z), numbers (1-10), hand orientation, and webcam practice tips using our curated ISL curriculum. What sign would you like to explore?",
      retrieved_sources: [],
      created_at: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<number | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const query = (messageText || input).trim();
    if (!query || isSending) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      message: query,
      retrieved_sources: [],
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const resp = await chatbotService.ask(query, sessionId);
      if (!sessionId) {
        setSessionId(resp.session_id);
      }

      const tutorMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: 'tutor',
        message: resp.answer,
        retrieved_sources: resp.sources,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: 'tutor',
        message: 'I encountered an error retrieving verified ISL knowledge. Please try asking again.',
        retrieved_sources: [],
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const samplePrompts = [
    'How do I perform the ISL sign for K?',
    'How do I sign number 8 in ISL?',
    'What are the best tips for webcam sign recognition?',
    'Explain the sign for letter A',
  ];

  return (
    <div className="flex-1 flex flex-col h-screen">
      <TopBar
        title="RAG AI Tutor"
        subtitle="Retrieval-Augmented Guidance grounded in OVIA's verified Indian Sign Language knowledge base."
      />

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-4">
        {messages.map((msg) => (
          <ChatMessageBubble
            key={msg.id}
            sender={msg.sender}
            message={msg.message}
            sources={msg.retrieved_sources}
            timestamp={msg.created_at}
          />
        ))}

        {isSending && (
          <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
            <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" />
            <span>Searching curated ISL knowledge base and generating grounded response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input & Suggested Prompts Footer */}
      <div className="p-4 bg-white border-t border-slate-200/80 max-w-4xl mx-auto w-full">
        {/* Suggested Prompts */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 text-xs">
          <span className="text-slate-400 font-semibold shrink-0">Try asking:</span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors shrink-0 cursor-pointer font-medium"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Query Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about performing any ISL sign, numbers, or hand positions..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-hidden transition-all text-slate-900"
          />
          <Button
            type="submit"
            isLoading={isSending}
            disabled={!input.trim()}
            variant="primary"
            leftIcon={<Send className="w-4 h-4" />}
          >
            Ask Tutor
          </Button>
        </form>
      </div>
    </div>
  );
};
