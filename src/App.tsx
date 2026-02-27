import React, { useState, useEffect, useRef } from 'react';
import { GameLayout } from './components/GameLayout';
import { GameResponse } from './types';
import { createGameChat } from './services/gameService';

export default function App() {
  const [gameData, setGameData] = useState<GameResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitial, setIsInitial] = useState(true);
  
  // Store the chat instance
  const chatRef = useRef<any>(null);

  useEffect(() => {
    // Initialize game
    const initGame = async () => {
      setIsLoading(true);
      try {
        chatRef.current = createGameChat();
        const response = await chatRef.current.sendMessage({ message: "Mulai permainan baru." });
        const data: GameResponse = JSON.parse(response.text);
        
        setGameData(data);
        setIsInitial(data.options.length === 0);
      } catch (error) {
        console.error("Failed to initialize game:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initGame();
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!chatRef.current) return;

    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: text });
      const data: GameResponse = JSON.parse(response.text);
      
      setGameData(data);
      setIsInitial(data.options.length === 0);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GameLayout 
      gameData={gameData} 
      isLoading={isLoading} 
      onSendMessage={handleSendMessage} 
      isInitial={isInitial}
    />
  );
}
