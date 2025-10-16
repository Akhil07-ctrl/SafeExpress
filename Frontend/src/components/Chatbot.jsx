import { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaMinus } from 'react-icons/fa';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addMessage('bot', '👋 Hi there! I\'m your SafeExpress Assistant. How can I help you today?', [
        { text: '🚚 About SafeExpress', value: 'about' },
        { text: '📦 Track Vehicle', value: 'track' },
        { text: '💰 Pricing Plans', value: 'pricing' },
        { text: '📞 Contact Support', value: 'contact' }
      ]);
    }
  }, [isOpen]);

  const addMessage = (sender, text, quickReplies = []) => {
    setMessages(prev => [...prev, { sender, text, quickReplies, timestamp: new Date() }]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    addMessage('user', input);
    const userInput = input;
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(async () => {
      const response = await getAIResponse(userInput);
      addMessage('bot', response.text, response.quickReplies);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickReply = async (value) => {
    addMessage('user', value);
    setIsTyping(true);

    setTimeout(async () => {
      const response = await getAIResponse(value);
      addMessage('bot', response.text, response.quickReplies);
      setIsTyping(false);
    }, 1000);
  };

  const getAIResponse = async (input) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          context: messages.slice(-5) // Send last 5 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      return {
        text: data.response,
        quickReplies: data.quickReplies || []
      };
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Fallback to predefined responses if API fails
      const responses = {
        about: {
          text: 'SafeExpress is a comprehensive fleet management solution that helps businesses track, manage, and optimize their vehicle fleets. We offer real-time tracking, maintenance scheduling, fuel management, and more.',
          quickReplies: [
            { text: '📦 Track Vehicle', value: 'track' },
            { text: '💰 Pricing Plans', value: 'pricing' }
          ]
        },
        track: {
          text: 'To track your vehicle, please provide your tracking ID or vehicle number. You can also check the status on our dashboard.',
          quickReplies: [
            { text: '🚚 About SafeExpress', value: 'about' },
            { text: '📞 Contact Support', value: 'contact' }
          ]
        },
        pricing: {
          text: 'Our pricing plans start from ₹999/month for basic tracking to ₹4999/month for enterprise solutions. Contact us for a custom quote!',
          quickReplies: [
            { text: '📞 Contact Support', value: 'contact' },
            { text: '🚚 About SafeExpress', value: 'about' }
          ]
        },
        contact: {
          text: 'You can reach our support team at support@safeexpress.com or call +91-1234567890. We\'re here to help!',
          quickReplies: [
            { text: '🚚 About SafeExpress', value: 'about' },
            { text: '📦 Track Vehicle', value: 'track' }
          ]
        },
        default: {
          text: 'I\'ll connect you with our support team for detailed help. Would you like me to do that?',
          quickReplies: [
            { text: '📞 Contact Support', value: 'contact' },
            { text: '🚚 About SafeExpress', value: 'about' }
          ]
        }
      };

      return responses[input.toLowerCase()] || responses.default;
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
        >
          <FaRobot size={24} />
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 h-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col animate-fadeInUp">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <h3 className="font-semibold">SafeExpress Assistant</h3>
            <div className="flex gap-2">
              <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded">
                <FaMinus size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded">
                <FaTimes size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-3 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 shadow'
                  }`}>
                  {msg.text}
                </div>
                {msg.quickReplies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {msg.quickReplies.map((reply, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickReply(reply.value)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm transition-colors"
                      >
                        {reply.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="text-left mb-4">
                <div className="inline-block p-3 rounded-lg bg-white text-gray-800 shadow">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
