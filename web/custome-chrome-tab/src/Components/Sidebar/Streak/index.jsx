/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";

const StreakComponent = ({ textClass }) => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [weekStreak, setWeekStreak] = useState([]);
  const [lastActiveDate, setLastActiveDate] = useState(null);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("streakData")) || {
      currentStreak: 0,
      longestStreak: 0,
      weekStreak: Array(7).fill(false),
      lastActiveDate: null,
    };

    setCurrentStreak(storedData.currentStreak);
    setLongestStreak(storedData.longestStreak);
    setWeekStreak(storedData.weekStreak);
    setLastActiveDate(storedData.lastActiveDate);

    const today = new Date().toDateString();
    if (storedData.lastActiveDate !== today) {
      handleNewDay(today, storedData);
    }
  }, []);

  const handleNewDay = (today, storedData) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let updatedStreakCount = 0;
    const newWeekStreak = [...storedData.weekStreak];

    if (storedData.lastActiveDate === yesterday.toDateString()) {
      updatedStreakCount = storedData.currentStreak + 1;
    } else {
      updatedStreakCount = 1; // Reset streak if not active yesterday
    }

    newWeekStreak[new Date().getDay()] = true;

    setCurrentStreak(updatedStreakCount);
    setLongestStreak(Math.max(storedData.longestStreak, updatedStreakCount));
    setWeekStreak(newWeekStreak);
    setLastActiveDate(today);
    console.log(lastActiveDate)

    // Save updated data to localStorage
    localStorage.setItem(
      "streakData",
      JSON.stringify({
        currentStreak: updatedStreakCount,
        longestStreak: Math.max(storedData.longestStreak, updatedStreakCount),
        weekStreak: newWeekStreak,
        lastActiveDate: today,
      })
    );
  };

  return (
   
      <div className={` ${textClass} fixed w-11/12 bottom-3 border border-white/20 p-4 rounded-lg bg-opacity-50 bg-white/20`}>
        <h3 className="font-bold ">Streaks</h3>
        <p className="mt-2 ">
          Current Streak: <strong>{currentStreak}</strong>
        </p>
        <p className="mt-1 ">
          Longest Streak: <strong>{longestStreak}</strong>
        </p>
        <div className="mt-4 flex gap-2">
          {weekStreak.map((active, index) => (
            <div key={index}>
              <img
                src={active ? "./icons/star-solid.svg" : "./icons/star-regular.svg"}
                alt="Star"
                className="w-6 h-6"
              />
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm ">
          A new day is counted as active if you open the browser.
        </p>
      </div>

  );
};

export default StreakComponent;
