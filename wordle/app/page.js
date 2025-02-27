"use client"

import React, { useState, useEffect } from 'react';

const WordleGame = () => {
  const [solution, setSolution] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [keyboardStatus, setKeyboardStatus] = useState({});

  // Türkçe kelimeler listesi
  const turkishWords = [
    'KALEM', 'KITAP', 'BAHÇE', 'ÇOCUK', 'DENIZ', 
    'GÜNEŞ', 'AĞAÇ', 'KUŞAK', 'PARÇA', 'MÜZIK', 
    'DUYGU', 'DOĞA', 'ŞEKER', 'DÜNYA', 'KADIN'
  ];

  // Oyunu başlat
  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    // Rastgele bir kelime seç
    const randomWord = turkishWords[Math.floor(Math.random() * turkishWords.length)];
    setSolution(randomWord);
    setGuesses(Array(6).fill(null));
    setCurrentGuess('');
    setGameOver(false);
    setMessage('');
    setKeyboardStatus({});
  };

  // Kullanıcının klavye girdilerini dinle
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      
      if (e.key === 'Enter') {
        submitGuess();
      } else if (e.key === 'Backspace') {
        setCurrentGuess(prev => prev.slice(0, -1));
      } else if (/^[a-zçğıöşüA-ZÇĞİÖŞÜ]$/.test(e.key)) {
        if (currentGuess.length < 5) {
          setCurrentGuess(prev => (prev + e.key).toUpperCase());
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, gameOver]);

  const submitGuess = () => {
    if (currentGuess.length !== 5) {
      setMessage('Lütfen 5 harfli bir kelime girin');
      return;
    }

    // Tahminleri güncelle
    const newGuesses = [...guesses];
    const firstEmptyIndex = newGuesses.findIndex(guess => guess === null);
    
    if (firstEmptyIndex !== -1) {
      newGuesses[firstEmptyIndex] = currentGuess;
      setGuesses(newGuesses);
      
      // Tahminin doğru olup olmadığını kontrol et
      if (currentGuess === solution) {
        setMessage('Tebrikler! Doğru tahmin ettiniz!');
        setGameOver(true);
      } else if (firstEmptyIndex === 5) {
        setMessage(`Oyun bitti! Doğru cevap: ${solution}`);
        setGameOver(true);
      }
      
      // Klavye durumunu güncelle
      updateKeyboardStatus(currentGuess);
      
      // Mevcut tahmini temizle
      setCurrentGuess('');
    }
  };

  const updateKeyboardStatus = (guess) => {
    const newStatus = { ...keyboardStatus };
    
    [...guess].forEach((letter, i) => {
      if (solution[i] === letter) {
        newStatus[letter] = 'correct';
      } else if (solution.includes(letter) && newStatus[letter] !== 'correct') {
        newStatus[letter] = 'present';
      } else if (!solution.includes(letter)) {
        newStatus[letter] = 'absent';
      }
    });
    
    setKeyboardStatus(newStatus);
  };

  const getLettterStatus = (letter, position, rowIndex) => {
    const guess = guesses[rowIndex];
    
    if (!guess) return '';
    
    if (solution[position] === letter) {
      return 'bg-green-500';
    } else if (solution.includes(letter)) {
      return 'bg-yellow-500';
    } else {
      return 'bg-gray-600';
    }
  };

  // Türkçe klavye düzeni
  const keyboard = [
    ['E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', 'İ'],
    ['Z', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç']
  ];

  const getKeyClass = (key) => {
    if (!keyboardStatus[key]) return 'bg-gray-400';
    if (keyboardStatus[key] === 'correct') return 'bg-green-500';
    if (keyboardStatus[key] === 'present') return 'bg-yellow-500';
    return 'bg-gray-600';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-4">
      <h1 className="text-4xl font-bold mb-6">Kelime Tahmin</h1>
      
      {message && (
        <div className="mb-4 p-2 bg-gray-700 rounded">
          {message}
        </div>
      )}
      
      <div className="mb-8">
        {Array(6).fill(null).map((_, rowIndex) => (
          <div key={rowIndex} className="flex mb-2">
            {Array(5).fill(null).map((_, colIndex) => {
              const guess = guesses[rowIndex];
              const letter = guess ? guess[colIndex] : '';
              const currentRowGuess = rowIndex === guesses.findIndex(val => val === null);
              const isCurrentBox = currentRowGuess && colIndex === currentGuess.length;
              
              return (
                <div 
                  key={colIndex} 
                  className={`flex items-center justify-center w-12 h-12 border-2 ${
                    isCurrentBox ? 'border-white' : 'border-gray-600'
                  } m-1 font-bold text-xl ${
                    guess ? getLettterStatus(letter, colIndex, rowIndex) : ''
                  }`}
                >
                  {currentRowGuess && colIndex < currentGuess.length 
                    ? currentGuess[colIndex] 
                    : letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        {keyboard.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center mb-2">
            {rowIndex === 2 && (
              <button
                onClick={submitGuess}
                className="px-4 py-2 bg-blue-500 rounded mr-1"
              >
                Enter
              </button>
            )}
            
            {row.map(key => (
              <button
                key={key}
                onClick={() => {
                  if (currentGuess.length < 5) {
                    setCurrentGuess(prev => prev + key);
                  }
                }}
                className={`w-10 h-10 m-1 rounded font-bold ${getKeyClass(key)}`}
              >
                {key}
              </button>
            ))}
            
            {rowIndex === 2 && (
              <button
                onClick={() => setCurrentGuess(prev => prev.slice(0, -1))}
                className="px-4 py-2 bg-gray-500 rounded ml-1"
              >
                ←
              </button>
            )}
          </div>
        ))}
      </div>
      
      {gameOver && (
        <button
          onClick={startGame}
          className="mt-6 px-6 py-2 bg-blue-500 rounded hover:bg-blue-600"
        >
          Yeni Oyun
        </button>
      )}
      
      <div className="mt-6 text-sm text-gray-400">
        <p>Yeşil: Doğru harf, doğru konum</p>
        <p>Sarı: Doğru harf, yanlış konum</p>
        <p>Gri: Harf kelimede yok</p>
      </div>
    </div>
  );
};

export default WordleGame;