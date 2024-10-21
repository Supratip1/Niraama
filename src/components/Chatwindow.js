import React, { useState, useRef } from 'react';
import clip from '../icons/clip.svg';
import send from '../icons/send.svg';
import voice from '../icons/voice.svg';
import micIcon from '../icons/voice.svg';
import AnimatedMessage from './AnimatedMessage';
import pencil from '../icons/pencil.svg';
import mind from '../icons/mind.webp'
import local_machine from '../icons/local_machine.svg'; // Import your local machine icon
import '../styles.css';

const ChatWindow = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef(null); // File input reference
  const [editMessageIndex, setEditMessageIndex] = useState(null); // Track the index of the message being edited
  const [isTyping, setIsTyping] = useState(false); // New state to manage bot "typing" status
  
  // Initialize SpeechRecognition API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  }

  // Update session history to store only the initial user message
  const updateSessionHistory = (newMessages) => {
    const currentSession = JSON.parse(sessionStorage.getItem('currentSession')) || [];
    const updatedSession = [...currentSession, ...newMessages];

    // Store only the initial user message
    const userInitialMessage = updatedSession[0]; // Get the first user message
    const allSessions = JSON.parse(sessionStorage.getItem('allSessions')) || [];

    // Only add the initial user message if the updated session is not empty
    if (updatedSession.length > 0) {
      allSessions.push([userInitialMessage]); // Push only the user's initial message to allSessions
      sessionStorage.setItem('allSessions', JSON.stringify(allSessions));
    }
  };

  const handleSendMessage = async (text = null) => {
    const content = text || message.trim();
    if (content) {
      // If we are editing a message
      if (editMessageIndex !== null) {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[editMessageIndex] = { ...updatedMessages[editMessageIndex], content }; // Update the message content
          sessionStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
          return updatedMessages;
        });
        setEditMessageIndex(null); // Reset the edit state after updating
      } else {
        // Normal message sending behavior
        const userMessage = { type: 'text', content, sender: 'user' };
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, userMessage];
          sessionStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
          return updatedMessages;
        });

        // Update session history with the initial user message
        updateSessionHistory([userMessage]);

        // Start the "typing" animation
        setIsTyping(true);

        // Simulate a delay before bot responds (e.g., 2 seconds)
        setTimeout(async () => {
          try {
            const witToken = "TBMF2SLKN2BRWIA6IVYK6P2N3UTJNLAL";
            const witResponse = await fetch(
              `https://api.wit.ai/message?v=20211010&q=${encodeURIComponent(content)}`,
              {
                headers: {
                  Authorization: `Bearer ${witToken}`,
                },
              }
            );
            const data = await witResponse.json();
            console.log(data)
            // Extract intent or traits from Wit.ai response
            let botReply = 'I am not sure how to respond to that.'; // Default response

if (data.intents && data.intents.length > 0) {
  // Use the first identified intent
  botReply = `I understand you are trying to express something related to ${data.intents[0].name}.`;
} else if (data.entities && Object.keys(data.entities).length > 0) {
  // If any entities are found, respond accordingly
  const emotionEntity = data.entities.emotion?.[0]?.value;
  const traitEntity = data.traits?.wit$sentiment?.[0]?.value; // Example of handling sentiment trait
  if (emotionEntity) {
    botReply = `I see you're feeling ${emotionEntity}.`;
  } else if (traitEntity) {
    botReply = `It seems you're feeling ${traitEntity}.`;
  }
}


            // Create a bot message based on Wit.ai response
            const botMessage = { type: 'text', content: botReply, sender: 'bot' };
            setMessages((prevMessages) => {
              const updatedMessages = [...prevMessages, botMessage];
              sessionStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
              return updatedMessages;
            });
          } catch (error) {
            console.error('Error fetching from Wit.ai:', error);
          } finally {
            setIsTyping(false); // Stop the "typing" animation after bot responds
          }
        }, 2000); // 2-second delay before bot response
      }

      // Clear the message input after sending/editing
      setMessage('');
    }
  };

  const saveMessage = (index, newContent) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      updatedMessages[index] = { ...updatedMessages[index], content: newContent }; // Update message content
      sessionStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
      return updatedMessages;
    });
    setEditMessageIndex(null); // Stop editing mode
  };

  const handleVoiceButtonClick = () => {
    if (!recognition) {
      alert("Speech Recognition API is not supported in your browser");
      return;
    }

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      handleSendMessage(speechToText);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input click
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const userMessage = { type: 'file', content: URL.createObjectURL(file), sender: 'user' };
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, userMessage];
        sessionStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
      event.target.value = ''; // Clear the input for future file selections
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white" style={{ width: '100%', maxWidth: '100%', margin: '0 auto' }}>
      <main className="flex-1 overflow-auto p-4 flex justify-center">
        <div className="conversation-container w-full max-w-2xl">
          <div className="flex justify-center mb-4">
          <AnimatedMessage
  message="🌿 Welcome to Niraama. Let's talk and find your peace together."
  style={{ fontFamily: "'Inter', sans-serif", fontSize: '2rem', fontWeight: 500 }}
/>


          </div>

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 text-left ${msg.sender === 'user' ? 'flex justify-end group' : 'flex justify-start'}`}
            >
              {msg.sender === 'user' && (
                <img
                  src={pencil}
                  alt="Edit"
                  className="w-4 h-4 cursor-pointer mr-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => setEditMessageIndex(index)} // Set the current message as being edited
                />
              )}
              {msg.sender === 'bot' && (
                <img
                  src={mind}
                  alt="GPT"
                  className="w-8 h-8 mr-2"
                />
              )}
              {msg.type === 'text' ? (
                editMessageIndex === index ? ( // Check if the message is being edited
                  <input
                    type="text"
                    value={msg.content}
                    className="p-3 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={(e) => {
                      const updatedMessages = [...messages];
                      updatedMessages[index].content = e.target.value;
                      setMessages(updatedMessages); // Update the message content in real-time
                    }}
                    onBlur={() => saveMessage(index, msg.content)} // Save the message when the user clicks away
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        saveMessage(index, msg.content); // Save the message when Enter is pressed
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <span
                    className={`p-3 rounded-lg shadow-md transition duration-150 ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                  >
                    {msg.content}
                  </span>
                )
              ) : msg.type === 'file' ? (
                <a href={msg.content} target="_blank" rel="noopener noreferrer" className="rounded-lg shadow-md">
                  <img src={msg.content} alt="Uploaded File" className="w-full max-w-xs rounded-lg shadow-md" />
                </a>
              ) : msg.type === 'meme' ? (
                <img src={msg.content} alt="Meme" className="w-full max-w-xs rounded-lg shadow-md" />
              ) : null}
            </div>
          ))}

          {/* Display typing indicator */}
          {isTyping && (
            <div className="mb-4 text-left flex justify-start">
              <div className="p-3 rounded-lg shadow-md bg-gray-100 text-gray-800">
                <span className="animate-pulse">Luminae is typing...</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Section */}
      
<footer className="bg-grey p-8 flex items-center justify-center rounded-lg shadow-md">
    <div className="relative w-3/4 max-w-2xl">
        <textarea
            placeholder="Type your message..."
            className="w-full p-3 pl-16 pr-14 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 resize-none" // Added pr-14 for padding
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
                // Check for Shift + Enter to add a new line
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault(); // Prevent default newline behavior
                    handleSendMessage(); // Send the message on Enter
                }
            }}
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, height: 'auto' }} // Set height to auto
            rows={1} // Set the initial rows
            onFocus={() => {
                // Reset height to auto when focused
                setTimeout(() => {
                    document.querySelector('textarea').style.height = 'auto';
                }, 0);
            }}
            onBlur={() => {
                // Set height back to original size
                document.querySelector('textarea').style.height = 'auto';
            }}
            onInput={(e) => {
                // Auto-resize the textarea
                e.target.style.height = 'auto'; // Reset the height
                e.target.style.height = `${e.target.scrollHeight}px`; // Set to the scroll height
            }}
        />
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }} // Hide the input
          onChange={handleFileChange}
        />
        {/* Attachment Button */}
        <button
            className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full flex items-center justify-center hover:bg-gray-400 transition duration-150"
            onMouseEnter={() => setIsHovered(true)} // Show popup on hover
            onMouseLeave={() => setIsHovered(false)} // Hide popup when not hovering
            onClick={handleAttachmentClick} // Click here for file input
        >
            <img src={clip} alt="Attach" className="w-6 h-6" />
        </button>

        {/* Voice Button */}
        <button
            className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-150"
            onClick={handleVoiceButtonClick}
        >
            <img src={voice} alt="Voice" className="w-6 h-6" />
        </button>

        {/* Send Button */}
        <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-150"
            onClick={() => handleSendMessage()}
        >
            <img src={send} alt="Send" className="w-6 h-6" />
        </button>
    </div>
</footer>


      {/* Mic Listening Pop-up */}
      {isListening && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            {/* Ripple Effect */}
            <div className="absolute w-32 h-32 rounded-full bg-blue-500 opacity-50 ripple-animation"></div>
            <div className="absolute w-32 h-32 rounded-full bg-blue-500 opacity-30 ripple-animation delay-100"></div>
            <div className="absolute w-32 h-32 rounded-full bg-blue-500 opacity-20 ripple-animation delay-200"></div>

            {/* Mic Icon with Pulsing Animation */}
            <div className="bg-white p-6 rounded-full flex items-center justify-center shadow-lg pulse-animation" style={{ width: '100px', height: '100px' }}>
              <img src={micIcon} alt="Mic" className="w-8 h-8" />
            </div>

            {/* Listening Text */}
            <div className="absolute text-white text-lg mt-4 animate-fadeIn">Listening...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
