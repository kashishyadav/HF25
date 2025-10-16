import React, { useState } from 'react';
import Display from './Display';
import Button from './Button';
import ConfettiExplosion from 'react-confetti-explosion';
import './Calculator.css';

const Calculator = () => {
  const [displayValue, setDisplayValue] = useState('0');
  const [steps, setSteps] = useState('');
  const [confetti, setConfetti] = useState(false);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [operator, setOperator] = useState(null);
  const [value, setValue] = useState(null);
  const [memory, setMemory] = useState(null);

  const handleClick = (label) => {
    if (!isNaN(label)) {
      if (waitingForOperand) {
        setDisplayValue(label);
        setWaitingForOperand(false);
      } else {
        setDisplayValue(displayValue === '0' ? label : displayValue + label);
      }
      setSteps(steps + label);
    } else {
      switch (label) {
        case '+':
        case '-':
        case '×':
        case '÷':
        case '=':
          handleOperation(label);
          break;
        case 'C':
          setDisplayValue('0');
          setValue(null);
          setOperator(null);
          setSteps('');
          break;
        case 'MC':
          setMemory(null);
          break;
        case 'M+':
          setMemory((memory || 0) + parseFloat(displayValue));
          break;
        case 'M-':
          setMemory((memory || 0) - parseFloat(displayValue));
          break;
        case 'MR':
          setDisplayValue(memory || '0');
          break;
        case '+/-':
          setDisplayValue((parseFloat(displayValue) * -1).toString());
          break;
        case '%':
          setDisplayValue((parseFloat(displayValue) / 100).toString());
          break;
        default:
          handleScientific(label);
          break;
      }
      setSteps(steps + ' ' + label + ' ');
    }
  };

  const handleOperation = (nextOperator) => {
    const inputValue = parseFloat(displayValue);

    if (value == null) {
      setValue(inputValue);
    } else if (operator) {
      const currentValue = value || 0;
      let newValue = currentValue;

      switch (operator) {
        case '+':
          newValue += inputValue;
          break;
        case '-':
          newValue -= inputValue;
          break;
        case '×':
          newValue *= inputValue;
          break;
        case '÷':
          if (inputValue === 0) {
            newValue = 'Error';
          } else {
            newValue /= inputValue;
          }
          break;
        default:
          break;
      }

      setValue(newValue);
      setDisplayValue(String(newValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);

    if ((nextOperator === '+' || nextOperator === '×') && (inputValue === 5 || inputValue === 6)) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 2000);
    }
  };

  const handleScientific = (label) => {
    const inputValue = parseFloat(displayValue);
    let newValue = inputValue;

    switch (label) {
      case 'x²':
        newValue = inputValue ** 2;
        break;
      case 'x³':
        newValue = inputValue ** 3;
        break;
      case 'xʸ':
        // handle later with another input
        break;
      case 'eˣ':
        newValue = Math.exp(inputValue);
        break;
      case '10ˣ':
        newValue = 10 ** inputValue;
        break;
      case '¹/x':
        newValue = 1 / inputValue;
        break;
      case '²√x':
        newValue = Math.sqrt(inputValue);
        break;
      case '³√x':
        newValue = Math.cbrt(inputValue);
        break;
      case 'ʸ√x':
        // handle later with another input
        break;
      case 'ln':
        newValue = Math.log(inputValue);
        break;
      case 'log₁₀':
        newValue = Math.log10(inputValue);
        break;
      case 'x!':
        newValue = factorial(inputValue);
        break;
      case 'sin':
        newValue = Math.sin(inputValue);
        break;
      case 'cos':
        newValue = Math.cos(inputValue);
        break;
      case 'tan':
        newValue = Math.tan(inputValue);
        break;
      case 'e':
        newValue = Math.E;
        break;
      case 'π':
        newValue = Math.PI;
        break;
      case 'Rand':
        newValue = Math.random();
        break;
      case 'Rad':
        // toggle radian/degree
        break;
      default:
        break;
    }

    setDisplayValue(String(newValue));
  };

  const factorial = (n) => {
    if (n === 0) return 1;
    return n * factorial(n - 1);
  };

  return (
    <div className="calculator">
      {confetti && <ConfettiExplosion />}
      <Display value={displayValue} steps={steps} />
      <div className="button-grid">
        {['(', ')', 'MC', 'M+', 'M-', 'MR', 'C', '+/-', '%', '÷'].map((label) => (
          <Button key={label} label={label} onClick={handleClick} className={label === '÷' ? 'operator' : ''} />
        ))}
        {['2ⁿᵈ', 'x²', 'x³', 'xʸ', 'eˣ', '10ˣ', '7', '8', '9', '×'].map((label) => (
          <Button key={label} label={label} onClick={handleClick} className={label === '×' ? 'operator' : ''} />
        ))}
        {['¹/x', '²√x', '³√x', 'ʸ√x', 'ln', 'log₁₀', '4', '5', '6', '-'].map((label) => (
          <Button key={label} label={label} onClick={handleClick} className={label === '-' ? 'operator' : ''} />
        ))}
        {['x!', 'sin', 'cos', 'tan', 'e', 'EE', '1', '2', '3', '+'].map((label) => (
          <Button key={label} label={label} onClick={handleClick} className={label === '+' ? 'operator' : ''} />
        ))}
        {['Rad', 'sinh', 'cosh', 'tanh', 'π', 'Rand', '0', '.', '='].map((label) => (
          <Button key={label} label={label} onClick={handleClick} className={label === '=' ? 'operator' : ''} />
        ))}
      </div>
    </div>
  );
};

export default Calculator;
