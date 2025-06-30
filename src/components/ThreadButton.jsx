import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ThreadButton = ({ threadId, replies = 0 }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    navigate(`/thread/${threadId}`);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      {t('thread.replies', { count: replies })}
    </button>
  );
};

export default ThreadButton; 