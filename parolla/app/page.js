"use client"
import React, { useState, useEffect } from 'react';

const WordGuessingGame = () => {
  // Kelimeler ve anlamları
  const words = [
    { letter: 'A', word: 'Armut', definition: 'Yumuşak, sulu, tatlı bir meyve' },
    { letter: 'B', word: 'Balık', definition: 'Suda yaşayan, solungaçla nefes alan omurgalı hayvan' },
    { letter: 'C', word: 'Ceviz', definition: 'Sert kabuklu, içi yenen bir ağaç meyvesi' },
    { letter: 'Ç', word: 'Çilek', definition: 'Kırmızı renkli, küçük, tatlı bir meyve' },
    { letter: 'D', word: 'Dergi', definition: 'Düzenli aralıklarla çıkan süreli yayın' },
    { letter: 'E', word: 'Elma', definition: 'Kırmızı veya yeşil kabuklu, beyaz etli, tatlı bir meyve' },
    { letter: 'F', word: 'Fındık', definition: 'Küçük, sert kabuklu, yağlı bir yemiş' },
    { letter: 'G', word: 'Gözlük', definition: 'Göz kusurlarını düzeltmek için kullanılan cam ve çerçeveden oluşan araç' },
    { letter: 'H', word: 'Havuç', definition: 'Turuncu renkli, tatlımsı, yer altında yetişen sebze' },
    { letter: 'I', word: 'Irmak', definition: 'Büyük akarsu' },
    { letter: 'İ', word: 'İncir', definition: 'Tatlı, yumuşak, çekirdekli bir meyve' },
    { letter: 'J', word: 'Jelatin', definition: 'Hayvansal kolajenden elde edilen, yiyeceklerde kıvam verici olarak kullanılan madde' },
    { letter: 'K', word: 'Kalem', definition: 'Yazı yazmaya yarayan araç' },
    { letter: 'L', word: 'Limon', definition: 'Sarı renkli, ekşi sulu bir narenciye meyvesi' },
    { letter: 'M', word: 'Mango', definition: 'Tropikal bölgelerde yetişen, sarı-turuncu etli, tatlı bir meyve' },
    { letter: 'N', word: 'Nar', definition: 'İçi kırmızı taneli, ekşimsi tatlı bir meyve' },
    { letter: 'O', word: 'Orman', definition: 'Ağaçlarla kaplı geniş alan' },
    { letter: 'Ö', word: 'Örgü', definition: 'İplik veya iple örülerek yapılan el işi' },
    { letter: 'P', word: 'Portakal', definition: 'Turuncu renkli, sulu, C vitamini açısından zengin bir meyve' },
    { letter: 'R', word: 'Radyo', definition: 'Elektromanyetik dalgalarla ses yayını yapan ve alan cihaz' },
    { letter: 'S', word: 'Saat', definition: 'Zamanı gösteren alet' },
    { letter: 'Ş', word: 'Şeker', definition: 'Tatlı tadı olan karbonhidrat' },
    { letter: 'T', word: 'Telefon', definition: 'Uzak mesafelerden konuşmayı sağlayan iletişim aracı' },
    { letter: 'U', word: 'Uçak', definition: 'Havada uçabilen, yolcu taşıyan büyük taşıt' },
    { letter: 'Ü', word: 'Üzüm', definition: 'Salkım halinde yetişen, küçük, sulu bir meyve' },
    { letter: 'V', word: 'Vişne', definition: 'Kırmızı renkli, ekşimsi bir meyve' },
    { letter: 'Y', word: 'Yıldız', definition: 'Gökyüzünde parlayan gök cismi' },
    { letter: 'Z', word: 'Zeytin', definition: 'Yeşil veya siyah renkli, küçük, yağlı bir meyve' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);
  const [bounceEffect, setBounceEffect] = useState(false);
  const [shake, setShake] = useState(false);

  const handleGuess = () => {
    if (guess.trim().toLowerCase() === words[currentIndex].word.toLowerCase()) {
      setMessage('Doğru tahmin!');
      setCorrectCount(correctCount + 1);
      setBounceEffect(true);
      setTimeout(() => {
        setBounceEffect(false);
        handleNextWord();
      }, 1500);
    } else {
      setMessage('Yanlış tahmin, tekrar deneyin!');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setShowAnswer(true);
    }
  };

  const handleSkip = () => {
    setMessage(`Pas geçildi. Cevap: ${words[currentIndex].word}`);
    setSkippedCount(skippedCount + 1);
    setShowAnswer(true);
    setTimeout(() => {
      handleNextWord();
    }, 2000);
  };

  const handleNextWord = () => {
    setFadeIn(false);
    setTimeout(() => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setGuess('');
        setMessage('');
        setShowAnswer(false);
        setFadeIn(true);
      } else {
        setGameOver(true);
      }
    }, 500);
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setGuess('');
    setMessage('');
    setCorrectCount(0);
    setSkippedCount(0);
    setShowAnswer(false);
    setGameOver(false);
    setFadeIn(true);
  };

  // Oyun alanı animasyonları için CSS sınıfları
  const fadeInClass = fadeIn ? "opacity-100 transition-opacity duration-500" : "opacity-0 transition-opacity duration-500";
  const bounceClass = bounceEffect ? "animate-bounce" : "";
  const shakeClass = shake ? "animate-shake" : "";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-10px); }
            40%, 80% { transform: translateX(10px); }
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
          .card-shadow {
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }
          .btn-hover {
            transition: all 0.3s ease;
          }
          .btn-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
      
      <div className={`max-w-md w-full mx-auto bg-white rounded-2xl overflow-hidden card-shadow ${fadeInClass}`}>
        {!gameOver ? (
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
              A'dan Z'ye <span className="text-pink-600">Kelime</span> Oyunu
            </h1>
            
            <div className={`mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl ${bounceClass}`}>
              <div className="flex items-center mb-3">
                <span className="text-2xl font-bold bg-indigo-600 text-white w-12 h-12 flex items-center justify-center rounded-full mr-3 shadow-md">
                  {words[currentIndex].letter}
                </span>
                <span className="text-lg font-medium text-indigo-800">harfi ile başlayan kelime</span>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-gray-700"><strong>Tanım:</strong> {words[currentIndex].definition}</p>
              </div>
            </div>
            
            <div className="mb-5">
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  className={`flex-1 text-[#252525] border-2 border-indigo-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${shakeClass}`}
                  placeholder="Cevabınızı yazın"
                  onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleGuess}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium py-3 px-4 rounded-lg btn-hover"
                >
                  Tahmin Et
                </button>
                <button
                  onClick={handleSkip}
                  className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium py-3 px-4 rounded-lg btn-hover"
                >
                  Pas Geç
                </button>
              </div>
            </div>
            
            {message && (
              <div className={`p-4 rounded-lg mb-5 ${message.startsWith('Doğru') ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : 'bg-red-100 text-red-800 border-l-4 border-red-500'}`}>
                {message}
              </div>
            )}
            
            {showAnswer && (
              <div className="p-4 bg-blue-100 text-blue-800 rounded-lg mb-5 border-l-4 border-blue-500">
                <p>Doğru cevap: <strong>{words[currentIndex].word}</strong></p>
                <button
                  onClick={handleNextWord}
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm btn-hover"
                >
                  Sonraki Kelime
                </button>
              </div>
            )}
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium">
                <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 rounded mr-1">
                  {currentIndex + 1}/{words.length}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded">
                  Doğru: {correctCount}
                </span>
                <span className="inline-block px-2 py-1 bg-gray-200 text-gray-800 rounded">
                  Pas: {skippedCount}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-8 bg-gradient-to-b from-indigo-50 to-white">
            <h1 className="text-3xl font-bold mb-6 text-indigo-700">Oyun Bitti!</h1>
            
            <div className="p-6 bg-white rounded-xl shadow-sm mb-6">
              <div className="flex justify-center items-center space-x-4 mb-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-green-600 mb-1">{correctCount}</div>
                  <div className="text-sm text-gray-600">Doğru</div>
                </div>
                
                <div className="h-16 border-l border-gray-300"></div>
                
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-600 mb-1">{skippedCount}</div>
                  <div className="text-sm text-gray-600">Pas</div>
                </div>
                
                <div className="h-16 border-l border-gray-300"></div>
                
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600 mb-1">{words.length}</div>
                  <div className="text-sm text-gray-600">Toplam</div>
                </div>
              </div>
              
              <p className="text-lg mb-3">
                <span className="font-semibold text-indigo-700">%{Math.round((correctCount / words.length) * 100)}</span> başarı oranı
              </p>
              
              <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full" 
                  style={{ width: `${(correctCount / words.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transform transition-transform duration-300 hover:scale-105 shadow-lg"
            >
              Yeniden Başla
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordGuessingGame;