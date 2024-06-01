import React from 'react';
import './Denied.css';

const Denied = () => {
  return (
    <div className="denied-container">
      <div className="overlay">
        <h1 className="denied-text">Vous n'avez pas le droit</h1>
      </div>
    </div>
  );
};

export default Denied;
