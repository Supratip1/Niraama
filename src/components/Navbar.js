import React, { useEffect, useState } from 'react';
import dotsIcon from '../icons/dots.svg'; // Import your three-dot icon
import trashIcon from '../icons/trash.svg'; // Import your trash icon (make sure you have the SVG)
import mind from '../icons/mind.webp'
const Navbar = () => {
  const [sessions, setSessions] = useState([]);
  const [showMenuIndex, setShowMenuIndex] = useState(null); // Track which session menu is open
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility

  useEffect(() => {
    // Load sessions from session storage when the component mounts
    const storedSessions = JSON.parse(sessionStorage.getItem('allSessions')) || [];
    setSessions(storedSessions);
  }, []);

  const handleSessionClick = (session) => {
    // Handle session click (you may want to implement logic to restore that session)
    console.log(session);
  };

  const handleDeleteSession = (index) => {
    // Delete session from the sessions array and session storage
    const updatedSessions = sessions.filter((_, i) => i !== index);
    setSessions(updatedSessions);
    sessionStorage.setItem('allSessions', JSON.stringify(updatedSessions));
    setShowMenuIndex(null); // Close the menu after deletion
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-4 flex flex-col">
      {/* Add custom scrollbar styles */}
      <style jsx>{`
        /* Custom scrollbar styles */
        ::-webkit-scrollbar {
          width: 8px; /* Width of the scrollbar */
        }

        ::-webkit-scrollbar-track {
          background: transparent; /* Background of the track */
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.5); /* Color of the scrollbar thumb */
          border-radius: 4px; /* Rounded edges for the thumb */
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.8); /* Color on hover */
        }

        /* Modal styles */
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7); /* Semi-transparent background */
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000; /* Higher z-index to overlay */
        }

        .modal-content {
          background: white;
          color: black;
          padding: 20px;
          border-radius: 8px;
          max-width: 500px;
          text-align: center;
        }

        .close-button {
          margin-top: 20px;
          background: #ff4757; /* Red color */
          color: white;
          border: none;
          border-radius: 5px;
          padding: 10px 15px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .close-button:hover {
          background: #ff6b81; /* Lighter red on hover */
        }
      `}</style>

      {/* Logo Section */}
      <div className="flex items-center mb-6 justify-center">
        <img
          src={mind} // Laughing emoji icon
          alt="MemeGPT Logo"
          className="w-12 h-12" // Logo size
        />
        <span
          className="text-3xl font-semibold ml-2"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Niraama
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow flex flex-col">
        {/* Sessions History */}
        <h2 className="text-lg font-semibold mb-4 text-center">Sessions History</h2>
        <div className="overflow-y-auto overflow-x-hidden flex-grow pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
          <ul className="space-y-2 max-h-64">
            {sessions.map((session, index) => (
              <li 
  key={index} 
  className="text-sm cursor-pointer hover:bg-gray-700 transition duration-200 rounded-lg p-2 relative flex justify-between items-center group" // Added 'group' class
  onClick={() => handleSessionClick(session)}
>
  <span className="truncate-text flex-grow"> {/* Apply class for truncation */}
    {session.map(msg => msg.content).join(', ')} {/* Join content of messages */}
  </span>

  {/* Three-Dot Menu Icon */}
  <div className="relative flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"> {/* Dots hidden by default */}
    <img
      src={dotsIcon}
      alt="Options"
      className="w-4 h-4 cursor-pointer ml-2" // Margin to create space
      onClick={(e) => {
        e.stopPropagation(); // Prevent click from triggering session click
        setShowMenuIndex(showMenuIndex === index ? null : index); // Toggle menu visibility
      }}
    />

    {/* Delete Menu */}
    {showMenuIndex === index && (
      <div className="absolute bg-white text-black border border-gray-300 rounded shadow-md mt-1 right-0 w-24"> {/* Set a fixed width for the popup */}
        <button
          onClick={() => handleDeleteSession(index)}
          className="flex items-center px-2 py-2 hover:bg-red-500 hover:text-white w-full text-left"
        >
          <img src={trashIcon} alt="Delete" className="w-4 h-4 mr-2" /> {/* Trash icon */}
          Delete
        </button>
      </div>
    )}
  </div>
</li>

            ))}
          </ul>
        </div>

        {/* About and Help links - Always at the bottom */}
        <div className="mt-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={toggleModal}
                className="hover:text-blue-500 transition duration-300 text-lg font-light block text-center w-full"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                About
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* About Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="text-2xl font-semibold mb-2">About MemeGPT</h2>
            <p className="mb-4">
            Niraama is an advanced AI-powered tool designed to enhance mental health and well-being with a 
            level of empathy and insight that feels human. Powered by cutting-edge GPT technology, 
            Niraama understands emotional nuances, personal contexts, and wellness trends to provide tailored support and resources.
            </p>
            <p className="mb-4"> Our mission is to revolutionize how mental health support is accessed and utilized, making it easier than ever for anyone to engage in their well-being journey—no prior experience required! Niraama brings 
            instant insights, personalized recommendations, and uplifting resources right to your fingertips. </p>
            <p className="mb-4"> This groundbreaking tool was created by <strong>Supratip Bhattacharya</strong>, combining the power of AI with the universal need for emotional wellness. </p>
            <button onClick={toggleModal} className="close-button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
