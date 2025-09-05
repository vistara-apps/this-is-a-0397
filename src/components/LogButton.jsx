import React, { useState } from 'react';
import { Plus, Check, Clock } from 'lucide-react';

const LogButton = ({ variant = 'quickRecord', onLog }) => {
  const [isLogging, setIsLogging] = useState(false);

  const handleClick = async () => {
    setIsLogging(true);
    
    // Simulate brief logging process
    setTimeout(() => {
      onLog();
      setIsLogging(false);
    }, 500);
  };

  if (variant === 'quickRecord') {
    return (
      <button
        onClick={handleClick}
        disabled={isLogging}
        className={`btn-primary flex items-center gap-2 transition-all ${
          isLogging ? 'opacity-75 cursor-not-allowed' : ''
        }`}
      >
        {isLogging ? (
          <>
            <Clock className="w-5 h-5 animate-spin" />
            Logging...
          </>
        ) : (
          <>
            <Plus className="w-5 h-5" />
            Quick Record
          </>
        )}
      </button>
    );
  }

  return null;
};

export default LogButton;