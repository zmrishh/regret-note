import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBrain, 
  FaHeart, 
  FaMagic, 
  FaPaperPlane, 
  FaStar,
  FaCommentDots,
  FaRobot
} from 'react-icons/fa';
import { MdEmojiEmotions } from 'react-icons/md';
import { StarsBackground } from '../components/ui/stars-background';
import { ShootingStars } from '../components/ui/shooting-stars';

// Vibrant Gen Z Slang and Vibes Bot Responses
const botResponses = {
  chaotic: [
    "no cap, i'm here for your unhinged thoughts 💯",
    "spill the tea, bestie. i'm all ears 🫖",
    "main character energy activated 🌟",
    "we're processing this vibe rn 💁‍♀️"
  ],
  healing: [
    "ur feelings are valid af 💖",
    "we're not okay, and that's okay 🤷‍♀️",
    "sending soft vibes your way 🌈",
    "you're literally doing amazing, sweetie 💅"
  ],
  real: [
    "let's get real for a sec 🔍",
    "unpacking this emotional baggage, go off 🧳",
    "radical self-awareness incoming 🚀",
    "emotional intelligence check ✨"
  ]
};

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "yo! i'm your emotional support ai. what's the tea today? 🫖", 
      sender: "bot",
      personality: "chaotic"
    }
  ]);
  const [input, setInput] = useState('');
  const [botPersonality, setBotPersonality] = useState("chaotic");
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
        text: `switched to ${personality} mode. let's get into it 💁‍♀️`, 
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
      className="relative min-h-screen bg-black overflow-hidden"
    >
      <div className="relative z-10 container mx-auto px-4 py-16">
        <StarsBackground />
        <ShootingStars />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-[calc(100vh-theme(spacing.20))] relative w-full p-4 flex items-center justify-center"
        >
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
                    flex items-center gap-2
                    ${botPersonality === personality 
                      ? 'bg-accent-orange text-white' 
                      : 'bg-white/10 hover:bg-white/20 text-white/70'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {personality === 'chaotic' && <FaMagic />}
                  {personality === 'healing' && <FaHeart />}
                  {personality === 'real' && <FaBrain />}
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
              {/* Header */}
              <div className="bg-white/5 p-4 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <FaRobot className="text-3xl text-accent-orange" />
                  <h2 className="text-xl font-bold text-white">
                    emotional ai companion
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  <MdEmojiEmotions className="text-yellow-300 text-2xl animate-bounce" />
                  <span className="text-sm text-white/70">
                    {botPersonality} mode
                  </span>
                </div>
              </div>

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
                          ${message.personality === 'chaotic' ? 'border-l-4 border-pink-500' 
                            : message.personality === 'healing' ? 'border-l-4 border-green-500' 
                            : 'border-l-4 border-blue-500'
                          }
                        `}
                      >
                        {message.sender === 'bot' && (
                          <FaStar className="absolute top-1 right-1 text-yellow-300 text-xs animate-pulse" />
                        )}
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
                    placeholder={`slide into my dms in ${botPersonality} mode...`}
                    className="flex-grow bg-black/20 rounded-xl border border-white/10 p-3 
                               text-white placeholder-white/30 focus:outline-none 
                               focus:ring-2 focus:ring-accent-orange/50 
                               transition-all duration-300"
                  />
                  <motion.button
                    onClick={handleSendMessage}
                    className="px-4 py-3 bg-accent-orange/10 text-white 
                               rounded-xl font-subheading font-bold
                               flex items-center gap-2
                               hover:bg-accent-orange/20 
                               transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaPaperPlane /> send it
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChatbotPage;
