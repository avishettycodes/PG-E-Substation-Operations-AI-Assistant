import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Chat container
const ChatContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

// Chat header
const ChatHeader = styled.div`
  background-color: #0072CE;
  color: #FFFFFF;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ChatStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
`;

const StatusDot = styled.div`
  width: 10px;
  height: 10px;
  background-color: #2ECC71;
  border-radius: 50%;
`;

// Messages container with dynamic height
const MessagesContainer = styled.div`
  height: 400px;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: #F9F9F9;

  scrollbar-width: thin;
  scrollbar-color: #CCCCCC #F1F1F1;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #F1F1F1;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #CCCCCC;
    border-radius: 4px;
  }
`;

// Base message bubble
const MessageBubble = styled.div`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 16px;
  line-height: 1.5;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  white-space: pre-wrap;
  overflow-wrap: break-word;
`;

// User message bubble
const UserMessage = styled(MessageBubble)`
  align-self: flex-end;
  background-color: #E3F2FD;
  color: #333333;
  border-bottom-right-radius: 2px;
`;

// Bot message bubble
const BotMessage = styled(MessageBubble)`
  align-self: flex-start;
  background-color: #FFFFFF;
  color: #333333;
  border-bottom-left-radius: 2px;
  border-left: 3px solid #0072CE;
`;

// Input container
const InputContainer = styled.div`
  padding: 15px 20px;
  display: flex;
  gap: 10px;
  background-color: #FFFFFF;
  border-top: 1px solid #EEEEEE;
`;

// Input field
const Input = styled.input`
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #DDDDDD;
  border-radius: 4px;
  font-size: 16px;
  color: #333333;
  background-color: #F9F9F9;
  
  &:focus {
    outline: none;
    border-color: #0072CE;
    background-color: #FFFFFF;
  }
  
  &::placeholder {
    color: #999999;
  }
`;

// Send button
const SendButton = styled.button`
  background-color: #FEC200;
  color: #FFFFFF;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
  
  &:hover {
    background-color: #F5B700;
  }
  
  &:disabled {
    background-color: #DDDDDD;
    cursor: not-allowed;
  }
`;

// Error message
const ErrorMessage = styled.div`
  color: #E74C3C;
  text-align: center;
  padding: 10px;
  margin: 10px 0;
  background-color: #FDEDEC;
  border-radius: 4px;
`;

// Loading indicator
const LoadingIndicator = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 10px;
  
  span {
    width: 8px;
    height: 8px;
    background-color: #0072CE;
    border-radius: 50%;
    animation: pulse 1.2s infinite ease-in-out;
    
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.2);
      opacity: 1;
    }
  }
`;

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'bot' }>>([
    { text: 'Hello! I\'m your PG&E Substation Operations Assistant. How can I help you today?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:7777/api/chat/query', {
        message: userMessage,
      });
      
      setMessages(prev => [...prev, { text: response.data.response, sender: 'bot' }]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Sorry, there was an error processing your request. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <ChatStatus>
          <StatusDot />
          <span>PG&E Assistant Online</span>
        </ChatStatus>
      </ChatHeader>
      
      <MessagesContainer>
        {messages.map((message, index) => (
          message.sender === 'user' ? (
            <UserMessage key={index}>{message.text}</UserMessage>
          ) : (
            <BotMessage key={index}>{message.text}</BotMessage>
          )
        ))}
        
        {isLoading && (
          <LoadingIndicator>
            <span></span>
            <span></span>
            <span></span>
          </LoadingIndicator>
        )}
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <div ref={messagesEndRef}></div>
      </MessagesContainer>
      
      <form onSubmit={handleSubmit}>
        <InputContainer>
          <Input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your question here..."
            disabled={isLoading}
          />
          <SendButton type="submit" disabled={isLoading || !input.trim()}>
            Send
          </SendButton>
        </InputContainer>
      </form>
    </ChatContainer>
  );
};

export default ChatInterface; 