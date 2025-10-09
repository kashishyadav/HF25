import React, { useState, useEffect, useRef } from 'react';
import { Info, Play, Pause, RotateCcw, Zap } from 'lucide-react';

const SolarSystemExplorer = () => {
  const canvasRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [time, setTime] = useState(0);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, isDragging: false, lastX: 0, lastY: 0 });
  const cameraRef = useRef({ rotation: 0, tilt: 0.3, zoom: 1 });

  const planets = [
    { name: 'Mercury', radius: 8, orbitRadius: 80, speed: 4.74, color: '#8C7853', info: 'Smallest planet, closest to the Sun. Surface temperature: 430°C (day), -180°C (night)' },
    { name: 'Venus', radius: 14, orbitRadius: 120, speed: 3.50, color: '#FFC649', info: 'Hottest planet due to greenhouse effect. Rotates backwards!' },
    { name: 'Earth', radius: 15, orbitRadius: 160, speed: 2.98, color: '#4A90E2', info: 'Our home! Only known planet with life. 71% water coverage.' },
    { name: 'Mars', radius: 10, orbitRadius: 200, speed: 2.41, color: '#E27B58', info: 'The Red Planet. Has the largest volcano in the solar system (Olympus Mons).' },
    { name: 'Jupiter', radius: 35, orbitRadius: 280, speed: 1.31, color: '#C88B3A', info: 'Largest planet. Has 95 known moons. The Great Red Spot is a storm twice Earth\'s size!' },
    { name: 'Saturn', radius: 30, orbitRadius: 360, speed: 0.97, color: '#FAD5A5', info: 'Famous for its beautiful rings made of ice and rock particles.' },
    { name: 'Uranus', radius: 20, orbitRadius: 420, speed: 0.68, color: '#4FD0E7', info: 'Ice giant that rotates on its side. Coldest planetary atmosphere.' },
    { name: 'Neptune', radius: 19, orbitRadius: 480, speed: 0.54, color: '#4166F5', info: 'Windiest planet with speeds up to 2,100 km/h. Has a dark spot similar to Jupiter.' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseDown = (e) => {
      mouseRef.current.isDragging = true;
      mouseRef.current.lastX = e.clientX;
      mouseRef.current.lastY = e.clientY;
    };

    const handleMouseMove = (e) => {
      if (mouseRef.current.isDragging) {
        const dx = e.clientX - mouseRef.current.lastX;
        const dy = e.clientY - mouseRef.current.lastY;
        cameraRef.current.rotation += dx * 0.005;
        cameraRef.current.tilt = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, cameraRef.current.tilt + dy * 0.005));
        mouseRef.current.lastX = e.clientX;
        mouseRef.current.lastY = e.clientY;
      }

      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseUp = () => {
      mouseRef.current.isDragging = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      cameraRef.current.zoom = Math.max(0.5, Math.min(2, cameraRef.current.zoom - e.deltaY * 0.001));
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel);

    const animate = () => {
      if (!isPaused) {
        setTime(t => t + 0.001 * speed);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background
      const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
      gradient.addColorStop(0, '#0a0e27');
      gradient.addColorStop(1, '#020308');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 200; i++) {
        const x = (i * 6373) % canvas.width;
        const y = (i * 9377) % canvas.height;
        const size = (i % 3) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const zoom = cameraRef.current.zoom;

      // Sun
      const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 40 * zoom);
      sunGradient.addColorStop(0, '#FFF5B6');
      sunGradient.addColorStop(0.3, '#FFD93D');
      sunGradient.addColorStop(1, '#FF6B35');
      ctx.fillStyle = sunGradient;
      ctx.shadowBlur = 40;
      ctx.shadowColor = '#FFD93D';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30 * zoom, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw orbits and planets
      planets.forEach((planet, index) => {
        const angle = time * planet.speed + index * 0.5;
        const orbitR = planet.orbitRadius * zoom;
        
        // Orbit
        if (showOrbits) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(centerX, centerY, orbitR, 0, Math.PI * 2);
          ctx.stroke();
        }

        // 3D position calculation
        const x = centerX + Math.cos(angle + cameraRef.current.rotation) * orbitR;
        const y = centerY + Math.sin(angle + cameraRef.current.rotation) * orbitR * Math.cos(cameraRef.current.tilt);
        const z = Math.sin(angle + cameraRef.current.rotation) * orbitR * Math.sin(cameraRef.current.tilt);

        // Planet
        const scale = (z + orbitR) / (orbitR * 2) * 0.5 + 0.5;
        const planetRadius = planet.radius * zoom * scale;
        
        const planetGradient = ctx.createRadialGradient(x - planetRadius * 0.3, y - planetRadius * 0.3, 0, x, y, planetRadius);
        planetGradient.addColorStop(0, planet.color);
        planetGradient.addColorStop(1, shadeColor(planet.color, -40));
        
        ctx.fillStyle = planetGradient;
        ctx.beginPath();
        ctx.arc(x, y, planetRadius, 0, Math.PI * 2);
        ctx.fill();

        // Saturn's rings
        if (planet.name === 'Saturn') {
          ctx.strokeStyle = 'rgba(250, 213, 165, 0.6)';
          ctx.lineWidth = 3 * zoom * scale;
          ctx.beginPath();
          ctx.ellipse(x, y, planetRadius * 1.8, planetRadius * 0.4, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Hover detection
        const dist = Math.sqrt((mouseRef.current.x - x) ** 2 + (mouseRef.current.y - y) ** 2);
        if (dist < planetRadius) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, planetRadius + 5, 0, Math.PI * 2);
          ctx.stroke();
          
          if (showLabels) {
            ctx.fillStyle = 'white';
            ctx.font = `bold ${12 * zoom}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText(planet.name, x, y - planetRadius - 10);
          }
        } else if (showLabels) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.font = `${10 * zoom}px Arial`;
          ctx.textAlign = 'center';
          ctx.fillText(planet.name, x, y - planetRadius - 8);
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, speed, showOrbits, showLabels, time]);

  const shadeColor = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const zoom = cameraRef.current.zoom;

    let clicked = null;
    planets.forEach((planet, index) => {
      const angle = time * planet.speed + index * 0.5;
      const orbitR = planet.orbitRadius * zoom;
      const px = centerX + Math.cos(angle + cameraRef.current.rotation) * orbitR;
      const py = centerY + Math.sin(angle + cameraRef.current.rotation) * orbitR * Math.cos(cameraRef.current.tilt);
      const z = Math.sin(angle + cameraRef.current.rotation) * orbitR * Math.sin(cameraRef.current.tilt);
      const scale = (z + orbitR) / (orbitR * 2) * 0.5 + 0.5;
      const planetRadius = planet.radius * zoom * scale;
      
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist < planetRadius) {
        clicked = planet;
      }
    });

    setSelectedPlanet(clicked);
  };

  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-4 shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Zap className="text-yellow-400" />
          Interactive Solar System Explorer
        </h1>
        <p className="text-sm text-gray-300 mt-1">Click and drag to rotate • Scroll to zoom • Click planets for info</p>
      </div>

      <div className="flex-1 flex">
        {/* Canvas */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          />

          {/* Controls */}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md rounded-lg p-4 text-white space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded transition"
              >
                {isPaused ? <Play size={20} /> : <Pause size={20} />}
              </button>
              <button
                onClick={() => { setTime(0); cameraRef.current = { rotation: 0, tilt: 0.3, zoom: 1 }; }}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded transition"
              >
                <RotateCcw size={20} />
              </button>
            </div>

            <div>
              <label className="text-xs flex items-center gap-2">
                <Zap size={14} />
                Speed: {speed.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showOrbits}
                  onChange={(e) => setShowOrbits(e.target.checked)}
                  className="rounded"
                />
                Show Orbits
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                  className="rounded"
                />
                Show Labels
              </label>
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md rounded-lg p-3 text-white text-xs max-w-xs">
            <Info size={16} className="inline mr-2" />
            <strong>Controls:</strong> Drag to rotate, scroll to zoom, click planets for details
          </div>
        </div>

        {/* Info Panel */}
        {selectedPlanet && (
          <div className="w-80 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6 overflow-y-auto shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedPlanet.name}</h2>
              <button
                onClick={() => setSelectedPlanet(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <div
                className="w-20 h-20 rounded-full mx-auto shadow-lg"
                style={{ backgroundColor: selectedPlanet.color }}
              />
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-black/30 p-3 rounded">
                <p className="text-gray-300">{selectedPlanet.info}</p>
              </div>

              <div className="bg-black/30 p-3 rounded space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Orbital Speed:</span>
                  <span className="font-semibold">{selectedPlanet.speed.toFixed(2)} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Distance from Sun:</span>
                  <span className="font-semibold">{selectedPlanet.orbitRadius} AU</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Relative Size:</span>
                  <span className="font-semibold">{selectedPlanet.radius} units</span>
                </div>
              </div>

              <div className="bg-indigo-600/20 border border-indigo-500/30 p-3 rounded">
                <p className="text-xs text-indigo-300">
                  💡 <strong>Did you know?</strong> This simulation uses simplified orbital mechanics. Real planets have elliptical orbits and varying speeds!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-gray-400 text-center py-2 text-xs">
        Educational Solar System Explorer • Built with React & Canvas API • Open Source Project
      </div>
    </div>
  );
};

export default SolarSystemExplorer;