import React, { useEffect, useState, useCallback } from 'react';
import Time from './Components/Time';
import GoogleSearchBar from './Components/GoogleSearchBar';
import TodoApp from './Components/To-Do';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import APOD from './Components/APOD';
import Menu from './Components/Menu';

const getTimeOfDay = () => {
  const hours = new Date().getHours();
  if (hours >= 0 && hours < 3) return 'late-night';
  if (hours >= 3 && hours < 6) return 'early-morning';
  if (hours >= 6 && hours < 9) return 'sunrise';
  if (hours >= 9 && hours < 12) return 'morning';
  if (hours >= 12 && hours < 15) return 'midday';
  if (hours >= 15 && hours < 18) return 'afternoon';
  if (hours >= 18 && hours < 21) return 'evening';
  return 'night';
};

function App() {
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());
  const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem('selectedTheme') || 'default');
  const [menuOpen, setMenuOpen] = useState(false);  
  const [isCodeCorrect, setIsCodeCorrect] = useState(false);
  const secretCode = 'APOD';

  useEffect(() => {
    const interval = setInterval(() => setTimeOfDay(getTimeOfDay()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleKeyDown = (event) => {
    if (event.key.toUpperCase() === 'M') setMenuOpen(prev => !prev);
    if (/^[A-Z]$/.test(event.key.toUpperCase())) handleSecretCode(event.key.toUpperCase());
  };

  const handleSecretCode = (key) => {
    setTypedCode(prev => {
      const newCode = prev + key;
      if (newCode === secretCode) {
        setIsCodeCorrect(true);
        return '';
      } else if (newCode.length > secretCode.length) {
        return key;
      }
      return newCode;
    });
  };

  const [,setTypedCode] = useState('');

  const getThemeClass = useCallback(() => {
    return selectedTheme !== 'default' ? selectedTheme : timeOfDay;
  }, [selectedTheme, timeOfDay]);

  const getClass = (type) => {
    const theme = getThemeClass();
    const classes = {
      background: {
        'late-night': 'bg-gradient-to-r from-gray-900 via-black to-gray-700',
        'early-morning': 'bg-gradient-to-r from-gray-800 via-purple-900 to-blue-900',
        'sunrise': 'bg-gradient-to-r from-orange-300 via-pink-400 to-yellow-500',
        'morning': 'bg-gradient-to-r from-blue-300 via-sky-400 to-indigo-500',
        'midday': 'bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500',
        'afternoon': 'bg-gradient-to-r from-orange-400 via-red-500 to-pink-500',
        'evening': 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600',
        'night': 'bg-gradient-to-r from-purple-800 via-indigo-900 to-gray-900',
        'default': 'bg-white'
      },
      text: {
        'late-night': 'text-gray-100',
        'early-morning': 'text-gray-100',
        'night': 'text-gray-100',
        'default': 'text-gray-900'
      },
      input: {
        'late-night': 'bg-gray-900 text-gray-200 placeholder-gray-400',
        'early-morning': 'bg-purple-900 text-gray-200 placeholder-gray-500',
        'sunrise': 'bg-orange-100 text-gray-900 placeholder-orange-400',
        'morning': 'bg-white text-gray-900 placeholder-gray-400',
        'midday': 'bg-yellow-200 text-gray-800 placeholder-yellow-500',
        'afternoon': 'bg-orange-200 text-gray-900 placeholder-orange-500',
        'evening': 'bg-purple-200 text-gray-800 placeholder-purple-400',
        'night': 'bg-gray-800 text-white placeholder-gray-600',
        'default': 'bg-white text-gray-800 placeholder-gray-400'
      },
      button: {
        'late-night': 'bg-gray-800 text-white hover:bg-gray-900',
        'early-morning': 'bg-purple-700 text-white hover:bg-purple-800',
        'sunrise': 'bg-orange-500 text-white hover:bg-orange-600',
        'morning': 'bg-blue-500 text-white hover:bg-blue-600',
        'midday': 'bg-yellow-500 text-white hover:bg-yellow-600',
        'afternoon': 'bg-red-500 text-white hover:bg-red-600',
        'evening': 'bg-pink-500 text-white hover:bg-pink-600',
        'night': 'bg-indigo-500 text-white hover:bg-indigo-600',
        'default': 'bg-blue-500 text-white hover:bg-blue-600'
      }
    };
    return classes[type][theme] || classes[type]['default'];
  };

  return (
    <div className={`${getClass('background')} min-h-screen transition-all duration-1500 ease-in-out`}>
      <Sidebar textClass={getClass('text')} />
      <Navbar />
      {menuOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50">
          <button className="text-white text-xl absolute top-16 right-32 z-50" onClick={() => setMenuOpen(false)}>✖</button>
          <Menu setTheme={setSelectedTheme} />
        </div>
      )}
      {isCodeCorrect ? (
        <div>
          <button className="text-xl font-bold right-2 hover:text-red-500 fixed top-6 right-8 z-50 text-white" onClick={() => setIsCodeCorrect(false)}>✖</button>
          <APOD />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <Time textClass={getClass('text')} />
          <GoogleSearchBar textClass={getClass('text')} inputClass={getClass('input')} buttonClass={getClass('button')} />
          <TodoApp buttonClass={getClass('button')} />
        </div>
      )}
    </div>
  );
}

export default App;
