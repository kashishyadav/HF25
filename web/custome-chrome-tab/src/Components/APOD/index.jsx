import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const APOD = () => {
  const [image, setImage] = useState("");
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchAPOD = async () => {
      try {
        const url = `https://api.nasa.gov/planetary/apod?api_key=z5hhCoqFeBu81pqbs4ecXWmqWhC14Guys64loKes`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const today = new Date().toISOString().split("T")[0];

        const cachedData = {
          image: result.hdurl,
          data: result.explanation,
          date: today,
        };
        console.log(today);

        // Save to localStorage
        localStorage.setItem("APOD", JSON.stringify(cachedData));

        // Update state
        setImage(result.hdurl);
        setData(result.explanation);
      } catch (error) {
        console.error("Error fetching APOD:", error);
      }
    };

    const loadAPOD = () => {
      const cachedAPOD = localStorage.getItem("APOD");
      const today = new Date().toISOString().split("T")[0];
      console.log(today);

      if (cachedAPOD) {
        const { image, data, date } = JSON.parse(cachedAPOD);

        if (date === today) {
          setImage(image);
          setData(data);
          return;
        }
      }

      fetchAPOD();
    };

    loadAPOD();

    const now = new Date();
    const millisUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();

    const midnightTimer = setTimeout(() => {
      fetchAPOD();
    }, millisUntilMidnight);

    return () => clearTimeout(midnightTimer);
  }, []);

  return (
    <div className="flex z-30 justify-center items-center h-screen backdrop-blur-lg bg-gradient-to-b from-[#0b0d1f] via-[#1a1b41] to-[#3a3d80] text-white">
      <motion.div
        className="relative w-1/3 max-h-[80vh] bg-white/30 backdrop-blur-lg rounded-2xl p-6 shadow-lg flex flex-col"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="flex-grow-[3] h-[400px] flex-shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {image && (
            <img
              src={image}
              alt="Astronomy Picture of the Day"
              className="w-full h-full object-fill rounded-xl"
            />
          )}
        </motion.div>
        <motion.div
          className="flex-grow-[2] text-white text-sm mt-4 max-h-[30vh] overflow-y-scroll p-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {data}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default APOD;
