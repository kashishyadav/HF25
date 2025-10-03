/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { motion } from "framer-motion";
import Advice from "./Advice";
import StreakComponent from "./Streak";
import Note from "./Note";


const Sidebar = ({ textClass }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={` ${textClass} relative `}>
      {/* Sidebar */}
      <motion.div
        className={`fixed top-0 left-0 h-screen ${isOpen ? "w-[30vw]" : "w-0"} overflow-hidden bg-opacity-40 bg-white backdrop-blur-lg border-r border-white/20 shadow-lg`}
        initial={{ width: "0vw" }}
        animate={{ width: isOpen ? "30vw" : "0vw" }}
        transition={{ duration: 0.6, ease: "easeInOut" }} 
      >

        <div className="flex justify-between items-center p-4">
          <h2 className="text-lg font-bold text-gray-700"></h2>
          <button
            className="text-xl font-bold text-gray-700 hover:text-red-500 "
            onClick={() => setIsOpen(false)}
          >
            ✖
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Notepad Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Note/>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
            transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1 }}
          >
            <div className="border border-white/20 p-4 rounded-lg bg-opacity-50 bg-white/20">
              <Advice textClass={textClass} />
            </div>
          </motion.div>

          {/* Streak Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
            transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1 }}
          >
            <StreakComponent textClass={textClass} />
          </motion.div>


        </div>
      </motion.div>

      {/* Toggle Button */}
      {
        isOpen ? <></> :
          <button
            className="fixed top-1/2 left-0 transform -translate-y-1/2 p-2"
            onClick={() => setIsOpen(true)}
          >
            <img src='./icons/angles-right-solid.svg' alt="Angles icon" className='w-5 h-5 object-cover' />
          </button>
      }
    </div>
  );
};

export default Sidebar;
