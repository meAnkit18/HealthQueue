"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MessageSquare } from "lucide-react"; // Assuming lucide-react is available or can be installed

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State to control chat window visibility

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const modelName = "gemini-2.0-flash";
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

      if (!apiKey) {
        setMessages(prev => [...prev, {role: 'assistant', content: "API Key for Gemini is not configured."}]);
        setIsLoading(false);
        return;
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [...[...messages, userMsg].map(m => ({
              role: m.role === "assistant" ? "model" : "user",
              parts: [{ text: m.content }],
            }))],
          }),
        }
      );

      if (!res.ok) {
          const errorData = await res.json();
          setMessages(prev => [...prev, {role: 'assistant', content: `Error from API: ${errorData.error.message}`}]);
          setIsLoading(false);
          return;
      }

      const data = await res.json();
      const modelResponse = data.candidates[0].content.parts[0].text;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: modelResponse },
      ]);
    } catch (error) {
      console.error("Error fetching from Gemini API:", error);
      setMessages(prev => [...prev, {role: 'assistant', content: "Sorry, something went wrong."}]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        className="rounded-full w-16 h-16 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageSquare className="w-8 h-8" />
      </Button>

      {isOpen && (
        <Card className="w-[400px] h-[500px] fixed bottom-24 right-4 shadow-xl flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md">Virtual Doctor Assistant</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              X
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 ${
                  msg.role === "user" ? "justify-end" : ""
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    Dr
                  </div>
                )}
                <div
                  className={`rounded-lg px-3 py-2 max-w-[70%] text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
                    U
                  </div>
                )}
              </div>
            ))}
          </CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}