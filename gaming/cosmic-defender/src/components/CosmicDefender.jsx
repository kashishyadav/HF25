import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Rocket, Star, Zap } from 'lucide-react';

const CosmicDefender = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu'); // menu, playing, paused, gameOver
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  
  const gameRef = useRef({
    player: { x: 375, y: 500, width: 40, height: 40, speed: 6, health: 100 },
    bullets: [],
    enemies: [],
    particles: [],
    powerUps: [],
    keys: {},
    lastShot: 0,
    shootCooldown: 250,
    enemySpawnRate: 1500,
    lastEnemySpawn: 0,
    animationId: null,
    powerUpTimer: 0,
    rapidFire: false
  });

  const initGame = () => {
    gameRef.current = {
      player: { x: 375, y: 500, width: 40, height: 40, speed: 6, health: 100 },
      bullets: [],
      enemies: [],
      particles: [],
      powerUps: [],
      keys: {},
      lastShot: 0,
      shootCooldown: 250,
      enemySpawnRate: 1500,
      lastEnemySpawn: 0,
      animationId: null,
      powerUpTimer: 0,
      rapidFire: false
    };
    setScore(0);
    setLevel(1);
  };

  const createParticles = (x, y, color, count = 15) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 1,
        color,
        size: Math.random() * 3 + 2
      });
    }
    return particles;
  };

  const spawnEnemy = (currentLevel) => {
    const types = ['basic', 'fast', 'tank', 'zigzag'];
    const type = types[Math.min(Math.floor(Math.random() * (1 + currentLevel / 3)), types.length - 1)];
    
    const configs = {
      basic: { width: 35, height: 35, speed: 2, health: 1, color: '#ef4444', points: 10 },
      fast: { width: 25, height: 25, speed: 4, health: 1, color: '#f59e0b', points: 20 },
      tank: { width: 50, height: 50, speed: 1, health: 3, color: '#8b5cf6', points: 50 },
      zigzag: { width: 30, height: 30, speed: 2.5, health: 2, color: '#06b6d4', points: 30, zigzag: true }
    };
    
    const config = configs[type];
    return {
      ...config,
      x: Math.random() * (750 - config.width),
      y: -config.height,
      type,
      zigzagOffset: 0
    };
  };

  const spawnPowerUp = (x, y) => {
    if (Math.random() < 0.3) {
      const types = ['health', 'rapidFire', 'shield'];
      const type = types[Math.floor(Math.random() * types.length)];
      return {
        x,
        y,
        width: 25,
        height: 25,
        type,
        speed: 2
      };
    }
    return null;
  };

  const checkCollision = (rect1, rect2) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  };

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const game = gameRef.current;
    const now = Date.now();

    // Clear canvas with trail effect
    ctx.fillStyle = 'rgba(10, 10, 30, 0.3)';
    ctx.fillRect(0, 0, 800, 600);

    // Stars background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 50; i++) {
      const x = (i * 137.5) % 800;
      const y = ((i * 137.5 + now * 0.05) % 600);
      ctx.fillRect(x, y, 2, 2);
    }

    // Update player position
    if (game.keys['ArrowLeft'] && game.player.x > 0) {
      game.player.x -= game.player.speed;
    }
    if (game.keys['ArrowRight'] && game.player.x < 800 - game.player.width) {
      game.player.x += game.player.speed;
    }
    if (game.keys['ArrowUp'] && game.player.y > 0) {
      game.player.y -= game.player.speed;
    }
    if (game.keys['ArrowDown'] && game.player.y < 600 - game.player.height) {
      game.player.y += game.player.speed;
    }

    // Shooting
    const cooldown = game.rapidFire ? 100 : game.shootCooldown;
    if (game.keys[' '] && now - game.lastShot > cooldown) {
      game.bullets.push({
        x: game.player.x + game.player.width / 2 - 2,
        y: game.player.y,
        width: 4,
        height: 15,
        speed: 8,
        damage: 1
      });
      game.lastShot = now;
    }

    // Draw player
    ctx.save();
    ctx.translate(game.player.x + game.player.width / 2, game.player.y + game.player.height / 2);
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(-15, 20);
    ctx.lineTo(0, 15);
    ctx.lineTo(15, 20);
    ctx.closePath();
    ctx.fill();
    
    // Engine glow
    ctx.fillStyle = game.rapidFire ? '#fbbf24' : '#ef4444';
    ctx.beginPath();
    ctx.arc(0, 18, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Update and draw bullets
    game.bullets = game.bullets.filter(bullet => {
      bullet.y -= bullet.speed;
      
      ctx.fillStyle = '#22d3ee';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#22d3ee';
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      ctx.shadowBlur = 0;
      
      return bullet.y > -bullet.height;
    });

    // Spawn enemies
    if (now - game.lastEnemySpawn > game.enemySpawnRate) {
      game.enemies.push(spawnEnemy(level));
      game.lastEnemySpawn = now;
    }

    // Update and draw enemies
    game.enemies = game.enemies.filter(enemy => {
      enemy.y += enemy.speed;
      
      if (enemy.zigzag) {
        enemy.zigzagOffset += 0.1;
        enemy.x += Math.sin(enemy.zigzagOffset) * 3;
      }
      
      // Draw enemy
      ctx.fillStyle = enemy.color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = enemy.color;
      
      if (enemy.type === 'basic') {
        ctx.beginPath();
        ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (enemy.type === 'fast') {
        ctx.beginPath();
        ctx.moveTo(enemy.x + enemy.width / 2, enemy.y);
        ctx.lineTo(enemy.x, enemy.y + enemy.height);
        ctx.lineTo(enemy.x + enemy.width, enemy.y + enemy.height);
        ctx.closePath();
        ctx.fill();
      } else if (enemy.type === 'tank') {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      } else {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = enemy.x + enemy.width / 2 + Math.cos(angle) * enemy.width / 2;
          const y = enemy.y + enemy.height / 2 + Math.sin(angle) * enemy.height / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      }
      
      ctx.shadowBlur = 0;
      
      // Check collision with player
      if (checkCollision(enemy, game.player)) {
        game.player.health -= 20;
        game.particles.push(...createParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.color, 20));
        if (game.player.health <= 0) {
          setGameState('gameOver');
          if (score > highScore) setHighScore(score);
        }
        return false;
      }
      
      return enemy.y < 600;
    });

    // Bullet-enemy collision
    game.bullets.forEach((bullet, bIndex) => {
      game.enemies.forEach((enemy, eIndex) => {
        if (checkCollision(bullet, enemy)) {
          enemy.health -= bullet.damage;
          game.bullets.splice(bIndex, 1);
          game.particles.push(...createParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.color, 8));
          
          if (enemy.health <= 0) {
            game.particles.push(...createParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.color, 25));
            const powerUp = spawnPowerUp(enemy.x, enemy.y);
            if (powerUp) game.powerUps.push(powerUp);
            game.enemies.splice(eIndex, 1);
            setScore(s => {
              const newScore = s + enemy.points;
              if (newScore > 0 && newScore % 500 === 0) {
                setLevel(l => l + 1);
                game.enemySpawnRate = Math.max(500, game.enemySpawnRate - 100);
              }
              return newScore;
            });
          }
        }
      });
    });

    // Update and draw power-ups
    game.powerUps = game.powerUps.filter(powerUp => {
      powerUp.y += powerUp.speed;
      
      const colors = {
        health: '#22c55e',
        rapidFire: '#f59e0b',
        shield: '#3b82f6'
      };
      
      ctx.fillStyle = colors[powerUp.type];
      ctx.shadowBlur = 15;
      ctx.shadowColor = colors[powerUp.type];
      ctx.beginPath();
      ctx.arc(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2, powerUp.width / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      if (checkCollision(powerUp, game.player)) {
        if (powerUp.type === 'health') {
          game.player.health = Math.min(100, game.player.health + 30);
        } else if (powerUp.type === 'rapidFire') {
          game.rapidFire = true;
          game.powerUpTimer = now + 5000;
        }
        game.particles.push(...createParticles(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2, colors[powerUp.type], 15));
        return false;
      }
      
      return powerUp.y < 600;
    });

    // Power-up timer
    if (game.rapidFire && now > game.powerUpTimer) {
      game.rapidFire = false;
    }

    // Update and draw particles
    game.particles = game.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
      
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      ctx.globalAlpha = 1;
      
      return p.life > 0;
    });

    // Draw HUD
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Level: ${level}`, 10, 60);
    
    // Health bar
    ctx.fillStyle = '#333';
    ctx.fillRect(650, 10, 140, 25);
    ctx.fillStyle = game.player.health > 50 ? '#22c55e' : game.player.health > 25 ? '#f59e0b' : '#ef4444';
    ctx.fillRect(655, 15, (game.player.health / 100) * 130, 15);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(650, 10, 140, 25);

    if (gameState === 'playing') {
      game.animationId = requestAnimationFrame(gameLoop);
    }
  }, [gameState, score, level, highScore]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        e.preventDefault();
        gameRef.current.keys[e.key] = true;
      }
      if (e.key === 'Escape' && gameState === 'playing') {
        setGameState('paused');
      }
    };

    const handleKeyUp = (e) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        e.preventDefault();
        gameRef.current.keys[e.key] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (gameRef.current.animationId) {
        cancelAnimationFrame(gameRef.current.animationId);
      }
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoop();
    }
    return () => {
      if (gameRef.current.animationId) {
        cancelAnimationFrame(gameRef.current.animationId);
      }
    };
  }, [gameState, gameLoop]);

  const startGame = () => {
    initGame();
    setGameState('playing');
  };

  const resumeGame = () => {
    setGameState('playing');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={600} 
          className="border-4 border-cyan-400 rounded-lg shadow-2xl shadow-cyan-500/50"
        />
        
        {gameState === 'menu' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 rounded-lg">
            <div className="text-center space-y-6 p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Rocket className="w-12 h-12 text-cyan-400" />
                <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Cosmic Defender
                </h1>
                <Rocket className="w-12 h-12 text-cyan-400 scale-x-[-1]" />
              </div>
              <p className="text-xl text-gray-300 max-w-md">
                Use arrow keys to move, space to shoot. Survive the cosmic invasion!
              </p>
              <div className="space-y-2 text-gray-400">
                <p className="flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" /> Collect power-ups for abilities
                </p>
                <p className="flex items-center justify-center gap-2">
                  <Star className="w-5 h-5 text-green-400" /> Earn points to level up
                </p>
              </div>
              {highScore > 0 && (
                <p className="text-2xl text-yellow-400 font-bold">High Score: {highScore}</p>
              )}
              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xl font-bold rounded-lg hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all shadow-lg shadow-cyan-500/50"
              >
                Start Game
              </button>
            </div>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 rounded-lg">
            <div className="text-center space-y-6">
              <h2 className="text-5xl font-bold text-cyan-400">Paused</h2>
              <p className="text-xl text-gray-300">Press ESC to pause/resume</p>
              <div className="space-x-4">
                <button
                  onClick={resumeGame}
                  className="px-6 py-3 bg-cyan-500 text-white text-lg font-bold rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Resume
                </button>
                <button
                  onClick={() => setGameState('menu')}
                  className="px-6 py-3 bg-red-500 text-white text-lg font-bold rounded-lg hover:bg-red-600 transition-colors"
                >
                  Main Menu
                </button>
              </div>
            </div>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 rounded-lg">
            <div className="text-center space-y-6 p-8">
              <h2 className="text-6xl font-bold text-red-500">Game Over</h2>
              <p className="text-3xl text-white">Final Score: <span className="text-cyan-400 font-bold">{score}</span></p>
              <p className="text-2xl text-yellow-400">Level Reached: {level}</p>
              {score === highScore && score > 0 && (
                <p className="text-2xl text-green-400 font-bold animate-pulse">New High Score!</p>
              )}
              <div className="space-x-4">
                <button
                  onClick={startGame}
                  className="px-6 py-3 bg-cyan-500 text-white text-lg font-bold rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Play Again
                </button>
                <button
                  onClick={() => setGameState('menu')}
                  className="px-6 py-3 bg-gray-600 text-white text-lg font-bold rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Main Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CosmicDefender;