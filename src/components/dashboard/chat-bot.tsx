'use client';
import { useState, useRef, useEffect } from 'react';
import { Bot, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { useDashboard } from './dashboard-provider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { chatAboutBloodValues } from '@/ai/flows/chat-about-blood-values';

type Message = {
    sender: 'user' | 'bot';
    text: string;
};

export function ChatBot() {
  const { bloodReport } = useDashboard();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaViewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaViewport.current) {
        scrollAreaViewport.current.scrollTop = scrollAreaViewport.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
        const response = await chatAboutBloodValues({
            bloodReport: bloodReport,
            question: currentInput
        });
        
        const botMessage: Message = { sender: 'bot', text: response.reply };
        setMessages(prev => [...prev, botMessage]);
    } catch (e) {
        console.error("Chatbot error:", e);
        const errorMessage: Message = { sender: 'bot', text: "Sorry, I'm having trouble connecting. Please try again later." };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-8 right-8 rounded-full h-16 w-16 shadow-lg z-50"
        >
          <Bot className="h-8 w-8" />
          <span className="sr-only">Open Chat</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 mr-4 mb-2" side="top" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">AI Health Assistant</h4>
            <p className="text-sm text-muted-foreground">
              Ask about your blood results or for general health tips.
            </p>
          </div>
          <ScrollArea className="h-64 w-full" viewportRef={scrollAreaViewport}>
              <div className="space-y-4 pr-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex items-start gap-2 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                    {message.sender === 'bot' && <Avatar className="h-8 w-8"><AvatarFallback>AI</AvatarFallback></Avatar>}
                    <div className={`rounded-lg px-3 py-2 text-sm max-w-[80%] break-words ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      {message.text}
                    </div>
                  </div>
                ))}
                {isLoading && <div className="flex items-start gap-2"><Avatar className="h-8 w-8"><AvatarFallback>AI</AvatarFallback></Avatar><div className="rounded-lg px-3 py-2 text-sm bg-muted animate-pulse">...</div></div>}
              </div>
          </ScrollArea>
          <div className="flex items-center gap-2">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
              placeholder="Ask a question..."
              disabled={isLoading}
            />
            <Button onClick={handleSend} size="icon" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
