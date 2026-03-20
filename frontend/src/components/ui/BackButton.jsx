import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
    >
      <ArrowLeft size={16} className="mr-1" />
      Back
    </button>
  );
};

export default BackButton;
