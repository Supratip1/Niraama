import React, { useEffect, useState } from 'react';
import './AnimatedMessage.css'; // Import the CSS file for styling

const AnimatedMessage = ({ message }) => {
  const [displayedMessage, setDisplayedMessage] = useState('');

  useEffect(() => {
    if (message) {
      let index = 0;
      const interval = setInterval(() => {
        if (index < message.length) {
          const newChar = message[index];
          setDisplayedMessage((prev) => prev + newChar); // Add one character at a time
          index++;
        } else {
          clearInterval(interval); // Stop the interval when the message is complete
        }
      }, 100); // Speed of the animation

      return () => clearInterval(interval); // Cleanup the interval on unmount
    }
  }, [message]);

  return (
    <div className="animated-message-container" style={{ display: 'flex', justifyContent: 'center' }}> {/* Center the message */}
      <div className="animated-message">
        {displayedMessage}
      </div>
    </div>
  );
};

export default AnimatedMessage;
