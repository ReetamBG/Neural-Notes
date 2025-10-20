"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

type Message = {
  sender: "user" | "ai";
  text: string;
};

export default function SingleChat({
  userId,
  currentFolderId,
  url
}: {
  userId: string;
  currentFolderId: string;
  url: string
}) {
  const [currentUserMessage, setCurrentUserMessage] = useState<Message | null>(
    null
  );
  const [currentAIMessage, setCurrentAIMessage] = useState<Message | null>(
    null
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentUserMessage, currentAIMessage, isLoading]);

  // Reset chat when folder changes
  useEffect(() => {
    setCurrentUserMessage(null);
    setCurrentAIMessage(null);
  }, [currentFolderId]);

  const handleSend = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setCurrentUserMessage(userMessage);
    setCurrentAIMessage(null); // clear previous AI message
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post(url, {
        query: userMessage.text,
        user_id: userId,
        folder_id: currentFolderId,
      });

      const aiMessage: Message = {
        sender: "ai",
        text: res.data.message || "No response",
      };

      setTimeout(() => setCurrentAIMessage(aiMessage), 300);
    } catch (err) {
      console.error(err);
      setTimeout(
        () =>
          setCurrentAIMessage({ sender: "ai", text: "Error getting response" }),
        300
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSend(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-2xl shadow overflow-hidden">
      <div className="flex-1 overflow-y-auto px-2 pt-4 pb-2 space-y-4 min-h-0 flex flex-col">
        {/* Fancy empty state */}
        {!currentUserMessage && !currentAIMessage && !isLoading && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-3 p-4"
          >
            <p className="text-center text-lg font-medium">
              Start chatting with your AI assistant!
            </p>
            <div className="flex space-x-2 mt-4">
              <motion.span
                className="w-3 h-3 bg-primary/50 rounded-full"
                animate={{ y: [0, -2, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: "easeInOut",
                  delay: 0,
                }}
              />
              <motion.span
                className="w-3 h-3 bg-primary/50 rounded-full"
                animate={{ y: [0, -2, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
              />
              <motion.span
                className="w-3 h-3 bg-primary/50 rounded-full"
                animate={{ y: [0, -2, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: "easeInOut",
                  delay: 0.6,
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Messages container */}
        <div className="flex flex-col space-y-4">
          {currentUserMessage && (
            <motion.div
              key={currentUserMessage.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="p-2 rounded-2xl max-w-max shadow-md bg-primary text-primary-foreground self-end ml-12 break-words"
            >
              {currentUserMessage.text}
            </motion.div>
          )}

          {currentAIMessage && (
            <motion.div
              key={currentAIMessage.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="p-2 rounded-2xl max-w-max shadow-md bg-muted text-muted-foreground self-start mr-12 break-words"
            >
              {currentAIMessage.text}
            </motion.div>
          )}

          {isLoading && !currentAIMessage && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex items-center self-start space-x-2 p-4 bg-muted rounded-2xl shadow-md mr-12 w-fit"
            >
              <span className="w-2 h-2 bg-primary animate-bounce rounded-full"></span>
              <span className="w-2 h-2 bg-primary animate-bounce delay-150 rounded-full"></span>
              <span className="w-2 h-2 bg-primary animate-bounce delay-300 rounded-full"></span>
            </motion.div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-shrink-0 p-2 border-t border-border">
        <form
          onSubmit={handleSend}
          className="flex gap-2 w-full"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg"
            onKeyDown={handleKeyDown}
          />
          <Button type="submit" disabled={isLoading} className="rounded-lg">
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
