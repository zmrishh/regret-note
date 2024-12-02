import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simulated bot responses with different personalities
const botResponses = {
  supportive: [
    "I hear you. Your feelings are valid.",
    "That sounds challenging. Let's work through this together.",
    "It's brave of you to open up about this.",
    "Every experience is an opportunity for growth."
  ],
  analytical: [
    "Let's break down this situation objectively.",
    "What patterns do you notice in this experience?",
    "How might this challenge contribute to your personal development?",
    "What insights can we extract from this moment?"
  ],
  empathetic: [
    "I can sense this is deeply affecting you.",
    "Your emotions are a powerful source of wisdom.",
    "It's okay to feel complex emotions.",
    "Vulnerability is strength in disguise."
  ]
};

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hey there! I'm your AI companion, ready to help you process your thoughts and feelings. What's on your mind today?", 
      sender: "bot",
      personality: "supportive"
    }
  ]);
  const [input, setInput] = useState('');
  const [botPersonality, setBotPersonality] = useState("supportive");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim()) {
      // Add user message
      const userMessage = { 
        id: Date.now(), 
        text: input, 
        sender: "user" 
      };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInput('');

      // Simulate bot response with dynamic personality
      setTimeout(() => {
        const responseOptions = botResponses[botPersonality];
        const botResponse = {
          id: Date.now() + 1,
          text: responseOptions[Math.floor(Math.random() * responseOptions.length)],
          sender: "bot",
          personality: botPersonality
        };
        setMessages(prevMessages => [...prevMessages, botResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const changePersonality = (personality) => {
    setBotPersonality(personality);
    setMessages(prevMessages => [
      ...prevMessages, 
      { 
        id: Date.now(), 
        text: `I've switched to ${personality} mode. How can I help you?`, 
        sender: "bot",
        personality: personality
      }
    ]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[calc(100vh-theme(spacing.20))] relative w-full p-4 flex items-center justify-center"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-orange/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-orange/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Personality Selector */}
        <motion.div 
          className="mb-4 flex justify-center space-x-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {Object.keys(botResponses).map((personality) => (
            <motion.button
              key={personality}
              onClick={() => changePersonality(personality)}
              className={`px-4 py-2 rounded-xl text-sm font-subheading 
                ${botPersonality === personality 
                  ? 'bg-accent-orange text-white' 
                  : 'bg-white/10 hover:bg-white/20 text-white/70'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {personality.charAt(0).toUpperCase() + personality.slice(1)} Mode
            </motion.button>
          ))}
        </motion.div>

        {/* Chat Container */}
        <motion.div
          className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {/* Messages Area */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: message.sender === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${message.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div 
                    className={`
                      max-w-[80%] px-4 py-3 rounded-2xl 
                      ${message.sender === 'bot' 
                        ? 'bg-white/10 text-white' 
                        : 'bg-accent-orange text-black'
                      }
                      ${message.personality === 'supportive' ? 'border-l-4 border-green-500' 
                        : message.personality === 'analytical' ? 'border-l-4 border-blue-500' 
                        : 'border-l-4 border-purple-500'
                      }
                    `}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/10 p-4 bg-white/5">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message in ${botPersonality} mode...`}
                className="flex-grow bg-black/20 rounded-xl border border-white/10 p-3 
                           text-white placeholder-white/30 focus:outline-none 
                           focus:ring-2 focus:ring-accent-orange/50 
                           transition-all duration-300"
              />
              <motion.button
                onClick={handleSendMessage}
                className="px-6 py-3 bg-accent-orange text-black 
                           rounded-xl font-subheading font-bold
                           hover:bg-accent-orange/90 
                           transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChatbotPage;
