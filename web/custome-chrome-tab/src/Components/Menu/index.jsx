/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const Menu = ({ setTheme }) => {
  const [selectedTheme, setSelectedTheme] = useState('default');

  useEffect(() => {
    const storedTheme = localStorage.getItem('selectedTheme');
    if (storedTheme) {
      setSelectedTheme(storedTheme);
      setTheme(storedTheme);
    }
  }, [setTheme]);

  const handleThemeChange = (event) => {
    const theme = event.target.value;
    setSelectedTheme(theme);
    setTheme(theme);
    localStorage.setItem('selectedTheme', theme); 
  };

  const handleSave = () => {
    localStorage.setItem('selectedTheme', selectedTheme);
    Swal.fire({
      title: "Saved!",
      text: "Your theme selection has been saved.",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  const handleDefault = () => {
    setSelectedTheme('default');
    setTheme('default');
    localStorage.setItem('selectedTheme', 'default');
    Swal.fire({
      title: "Reset to Default",
      text: "Your theme has been reset to the default.",
      icon: "info",
      confirmButtonText: "OK",
    });
  };

  const handleClear = () => {
    localStorage.removeItem('selectedTheme');
    setSelectedTheme('default');
    setTheme('default');
    Swal.fire({
      title: "Cleared!",
      text: "Your theme data has been cleared.",
      icon: "error",
      confirmButtonText: "OK",
    });
  };

  return (
    <div className="absolute w-[90vw] h-[90vh] top-[5vh] left-[5vw] bg-white/30 backdrop-blur-lg border-2 border-black rounded-2xl p-8 shadow-lg">
      <div className="text-4xl font-semibold text-gray-800 mb-6">Menu</div>

      <div className="mb-6">
        <label htmlFor="theme-select" className="block text-xl text-gray-800 mb-2">
          Customize Background Color / Cycle
        </label>
        <select
          id="theme-select"
          className="mt-2 w-full p-3 rounded-md bg-white text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedTheme}
          onChange={handleThemeChange}
        >
          <option value="default">Default (Cycle Based)</option>
          <option value="late-night">Late Night</option>
          <option value="early-morning">Early Morning</option>
          <option value="sunrise">Sunrise</option>
          <option value="morning">Morning</option>
          <option value="midday">Midday</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
          <option value="night">Night</option>
        </select>
      </div>

      <div className="text-lg text-gray-600 mb-6">
        <p>Manage Components</p>
      </div>

      <div className="absolute bottom-6 right-6 flex gap-4">
        <button
          className="bg-white/30 text-white p-3 rounded-full shadow-lg backdrop-blur-lg border border-white/50 hover:bg-white/40 flex items-center justify-center"
          onClick={handleSave}
        >
          <FontAwesomeIcon icon={faSave} size="lg" />
          <span className="ml-2">Save</span>
        </button>
        <button
          className="bg-white/30 text-white p-3 rounded-full shadow-lg backdrop-blur-lg border border-white/50 hover:bg-white/40 flex items-center justify-center"
          onClick={handleDefault}
        >
          <FontAwesomeIcon icon={faUndo} size="lg" />
          <span className="ml-2">Default</span>
        </button>
        <button
          className="bg-white/30 text-white p-3 rounded-full shadow-lg backdrop-blur-lg border border-white/50 hover:bg-white/40 flex items-center justify-center"
          onClick={handleClear}
        >
          <FontAwesomeIcon icon={faTrashAlt} size="lg" />
          <span className="ml-2">Clear</span>
        </button>
      </div>
    </div>
  );
};

export default Menu;
