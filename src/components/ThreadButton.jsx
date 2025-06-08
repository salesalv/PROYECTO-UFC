import React from 'react';
import { useNavigate } from 'react-router-dom';

const ThreadButton = ({ threadId }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    navigate(`/thread/${threadId}`);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      45 respuestas
    </button>
  );
};

export default ThreadButton; 