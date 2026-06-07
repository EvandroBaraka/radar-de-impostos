import React from 'react';
import './Loader.css';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = 'Processando cupom...' }) => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      {message && <p className="loader-message">{message}</p>}
    </div>
  );
};

export default Loader;
