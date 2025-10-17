import React from 'react';
import Button from './Button';

const MemoryButtons = ({ handleClick }) => {
  return (
    <div className="button-row">
      {['MC', 'M+', 'M-', 'MR'].map((label) => (
        <Button key={label} label={label} onClick={handleClick} />
      ))}
    </div>
  );
};

export default MemoryButtons;
