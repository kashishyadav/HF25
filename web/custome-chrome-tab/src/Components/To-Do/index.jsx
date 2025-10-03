/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TodoApp = ({buttonClass}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={` ${buttonClass} fixed bottom-6 right-6  text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300  `} >
        <img src='./icons/pen-to-square-solid.svg' alt="Edit icon" className=' w-5 h-5 object-cover' />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: 150, y: 200 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, x: 150, y: 200 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
            className="fixed top-20 right-10 bg-white bg-opacity-20 backdrop-blur-md rounded-lg shadow-lg p-6 w-[24vw] h-[60vh] flex flex-col"
            style={{
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">To-Do List</h2>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-grow p-2 rounded bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={addTask}
                className={` ${buttonClass}  text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300`}
              >
        <img src='./icons/pen-solid.svg' alt="Add icon" className=' w-5 h-5 object-cover' />
        </button>
            </div>
            <div className="flex-grow overflow-y-auto">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2 mb-2 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition duration-300"
                >
                  <span
                    onClick={() => toggleTask(task.id)}
                    className={`cursor-pointer flex-grow ${
                      task.completed
                        ? 'line-through text-gray-400'
                        : 'text-white'
                    }`}
                  >
                    {task.text}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-700 transition duration-300"
                  >
        <img src='./icons/trash-solid.svg' alt="Delete icon" className=' w-5 h-5 object-cover' />
        </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TodoApp;
