"use client"
import React, { useEffect, useRef, useState } from 'react';

const PingPongGame = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [gameMessage, setGameMessage] = useState("Başlamak için tıklayın");
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Game state
  const gameState = useRef({
    ball: { x: 400, y: 200, dx: 5, dy: 5, radius: 10 },
    paddle: { width: 10, height: 100, player: { y: 150 }, computer: { y: 150 } },
    canvas: { width: 800, height: 400 },
    keys: { ArrowUp: false, ArrowDown: false },
    scoreUpdated: false
  });
  
  // Handle resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        if (isFullscreen) {
          gameState.current.canvas.width = window.innerWidth;
          gameState.current.canvas.height = window.innerHeight;
          canvasRef.current.width = window.innerWidth;
          canvasRef.current.height = window.innerHeight;
        } else {
          const container = containerRef.current;
          if (container) {
            const containerWidth = container.clientWidth;
            gameState.current.canvas.width = containerWidth;
            gameState.current.canvas.height = containerWidth / 2;
            canvasRef.current.width = containerWidth;
            canvasRef.current.height = containerWidth / 2;
          }
        }
        
        // Reset ball position when resizing
        gameState.current.ball.x = gameState.current.canvas.width / 2;
        gameState.current.ball.y = gameState.current.canvas.height / 2;
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isFullscreen]);
  
  // Handle key events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        gameState.current.keys[e.key] = true;
        e.preventDefault();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        gameState.current.keys[e.key] = false;
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Game loop
  useEffect(() => {
    if (!gameStarted) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const state = gameState.current;
    
    // Make sure the canvas dimensions match the state
    canvas.width = state.canvas.width;
    canvas.height = state.canvas.height;
    
    const gameLoop = () => {
      // Clear canvas
      ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
      
      // Move player paddle
      if (state.keys.ArrowUp && state.paddle.player.y > 0) {
        state.paddle.player.y -= 7;
      }
      if (state.keys.ArrowDown && state.paddle.player.y < state.canvas.height - state.paddle.height) {
        state.paddle.player.y += 7;
      }
      
      // Simple AI for computer paddle
      const computerSpeed = 5;
      const computerCenter = state.paddle.computer.y + state.paddle.height / 2;
      const ballCenter = state.ball.y;
      
      if (computerCenter < ballCenter - 35) {
        state.paddle.computer.y += computerSpeed;
      } else if (computerCenter > ballCenter + 35) {
        state.paddle.computer.y -= computerSpeed;
      }
      
      // Move ball
      state.ball.x += state.ball.dx;
      state.ball.y += state.ball.dy;
      
      // Ball collision with top and bottom walls
      if (state.ball.y - state.ball.radius < 0 || state.ball.y + state.ball.radius > state.canvas.height) {
        state.ball.dy = -state.ball.dy;
      }
      
      // Ball collision with paddles
      // Player paddle
      if (
        state.ball.x - state.ball.radius < state.paddle.width &&
        state.ball.y > state.paddle.player.y &&
        state.ball.y < state.paddle.player.y + state.paddle.height &&
        state.ball.dx < 0 // Ball is moving left
      ) {
        state.ball.dx = -state.ball.dx;
        
        // Add some variation based on where the ball hits the paddle
        const hitPosition = (state.ball.y - state.paddle.player.y) / state.paddle.height;
        state.ball.dy = 10 * (hitPosition - 0.5);
      }
      
      // Computer paddle
      if (
        state.ball.x + state.ball.radius > state.canvas.width - state.paddle.width &&
        state.ball.y > state.paddle.computer.y &&
        state.ball.y < state.paddle.computer.y + state.paddle.height &&
        state.ball.dx > 0 // Ball is moving right
      ) {
        state.ball.dx = -state.ball.dx;
        
        // Add some variation based on where the ball hits the paddle
        const hitPosition = (state.ball.y - state.paddle.computer.y) / state.paddle.height;
        state.ball.dy = 10 * (hitPosition - 0.5);
      }
      
      // Score points
      if (state.ball.x < 0) {
        // Computer scores
        setScore(prevScore => ({ 
          ...prevScore, 
          computer: prevScore.computer + 1 
        }));
        //console.log(score)
        resetBall(1);
      } else if (state.ball.x > state.canvas.width) {
        // Player scores
        setScore(prevScore => ({ 
          ...prevScore, 
          player: prevScore.player + 1 
        }));
        resetBall(-1);
      }
      
      // Draw everything
      drawGame(ctx, state);
      
      requestAnimationFrame(gameLoop);
    };
    
    const resetBall = (direction) => {
      state.ball.x = state.canvas.width / 2;
      state.ball.y = state.canvas.height / 2;
      state.ball.dx = 5 * direction;
      state.ball.dy = (Math.random() * 6) - 3;
    };
    
    const gameLoopId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(gameLoopId);
  }, [gameStarted]);
  
  const drawGame = (ctx, state) => {
    // Draw background
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
    
    // Draw middle line
    ctx.strokeStyle = "#fff";
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(state.canvas.width / 2, 0);
    ctx.lineTo(state.canvas.width / 2, state.canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw paddles
    ctx.fillStyle = "#fff";
    
    // Player paddle
    ctx.fillRect(
      0, 
      state.paddle.player.y, 
      state.paddle.width, 
      state.paddle.height
    );
    
    // Computer paddle
    ctx.fillRect(
      state.canvas.width - state.paddle.width, 
      state.paddle.computer.y, 
      state.paddle.width, 
      state.paddle.height
    );
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw score
    ctx.font = "32px Arial";
    ctx.textAlign = "center";
    ctx.fillText(score.player.toString(), state.canvas.width / 4, 50);
    ctx.fillText(score.computer.toString(), (state.canvas.width / 4) * 3, 50);
  };
  
  const handleStartGame = () => {
    if (!gameStarted) {
      setGameStarted(true);
      setGameMessage("");
    }
  };
  
  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg w-full" ref={containerRef}>
      <div className="mb-4 flex justify-between w-full max-w-4xl">
        <div className="text-xl font-bold">Sen: {score.player}</div>
        <div className="text-xl font-bold">Bilgisayar: {score.computer}</div>
      </div>
      
      <div className="relative w-full max-w-4xl" onClick={handleStartGame}>
        <canvas 
          ref={canvasRef} 
          className="bg-black rounded-lg border-2 border-gray-400 w-full"
        />
        
        {!gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
            <div className="text-white text-2xl font-bold p-4 bg-gray-800 rounded">
              {gameMessage}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-gray-700 w-full max-w-4xl">
        <p>Kontroller:</p>
        <ul className="list-disc pl-5">
          <li>Raketi hareket ettirmek için yukarı ve aşağı ok tuşları</li>
          <li>Tam ekran yapmak için F tuşuna basın</li>
        </ul>
        <button 
          onClick={toggleFullscreen} 
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isFullscreen ? "Tam Ekrandan Çık" : "Tam Ekran Yap"}
        </button>
      </div>
    </div>
  );
};

export default PingPongGame;