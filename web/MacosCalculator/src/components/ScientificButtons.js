import React from 'react';
import Button from './Button';

const ScientificButtons = ({ handleClick }) => {
  return (
    <div className="button-row">
      {['(', ')', '2nd', 'x²', 'x³', 'xʸ', 'eˣ', '10ˣ', '¹/x', '²√x', '³√x', 'ʸ√x', 'ln', 'log₁₀', 'x!', 'sin', 'cos', 'tan', 'e', 'EE', 'Rad', 'sinh', 'cosh', 'tanh', 'π', 'Rand'].map((label) => (
        <Button key={label} label={label} onClick={handleClick} />
      ))}
    </div>
  );
};

export default ScientificButtons;
