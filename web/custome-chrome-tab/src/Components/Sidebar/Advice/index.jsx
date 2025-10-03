/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'

function Advice({textClass}) {
    const [advice, setAdvice] = useState('');

    useEffect(() => {
        const fetchAdvice = async () => {
            try {
                const response = await fetch('https://api.adviceslip.com/advice');
                const data = await response.json();
                setAdvice(data.slip.advice); 
            } catch (error) {
                console.error('Error fetching advice:', error);
            }
        };

        fetchAdvice();
    }, []);

  return (
    <div>
      <h1 className={` ${textClass} mt-2`}> &quot; {advice} &quot;</h1>
    </div>
  );
}

export default Advice;
