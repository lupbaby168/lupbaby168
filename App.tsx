import React, { useState, useEffect, useCallback } from 'react';
import { ClefType, GameState, LevelConfig, Doll, RewardData } from './types';
import { LEVELS, NOTE_NAMES } from './constants';
import Staff from './components/Staff';
import Collection from './components/Collection';
import { generateReward } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [currentLevel, setCurrentLevel] = useState<LevelConfig | null>(null);
  const [selectedMenuClef, setSelectedMenuClef] = useState<ClefType>(ClefType.TREBLE);
  
  // Gameplay State
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [feedback, setFeedback] = useState<'Correct' | 'Wrong' | null>(null);
  const [streak, setStreak] = useState<number>(0);

  // User Data
  const [unlockedDolls, setUnlockedDolls] = useState<Doll[]>([]);
  const [rewardData, setRewardData] = useState<RewardData | null>(null);
  const [loadingReward, setLoadingReward] = useState(false);

  // Logic to get note name from index
  const getNoteNameFromIndex = (idx: number) => {
    // Standardize: 0 is C.
    // Modulo 7 handles octaves.
    const normalized = ((idx % 7) + 7) % 7; 
    return NOTE_NAMES[normalized];
  };

  const generateNewQuestion = useCallback((level: LevelConfig) => {
    const range = level.notesRange.max - level.notesRange.min + 1;
    const randomOffset = Math.floor(Math.random() * range);
    const newNote = level.notesRange.min + randomOffset;
    
    // Prevent same note twice in a row if possible (unless range is tiny)
    setCurrentNoteIndex((prev) => {
      if (range > 1 && prev === newNote) {
        return newNote === level.notesRange.max ? newNote - 1 : newNote + 1;
      }
      return newNote;
    });
    setFeedback(null);
  }, []);

  const startGame = (level: LevelConfig) => {
    setCurrentLevel(level);
    setScore(0);
    setQuestionCount(0);
    setStreak(0);
    setGameState(GameState.PLAYING);
    generateNewQuestion(level);
  };

  const handleAnswer = (noteName: string) => {
    if (feedback !== null) return; // Prevent double clicking

    const correctName = getNoteNameFromIndex(currentNoteIndex);
    const isCorrect = noteName === correctName;

    if (isCorrect) {
      setFeedback('Correct');
      setScore(s => s + 10 + (streak * 2)); // Bonus for streak
      setStreak(s => s + 1);
    } else {
      setFeedback('Wrong');
      setStreak(0);
    }

    setTimeout(() => {
      const nextCount = questionCount + 1;
      if (currentLevel && nextCount >= currentLevel.totalQuestions) {
        finishLevel(score + (isCorrect ? 10 : 0));
      } else {
        setQuestionCount(nextCount);
        if (currentLevel) generateNewQuestion(currentLevel);
      }
    }, 1000);
  };

  const finishLevel = async (finalScore: number) => {
    setLoadingReward(true);
    setGameState(GameState.LEVEL_COMPLETE);

    if (currentLevel && finalScore >= currentLevel.requiredScore) {
       // Unlock Reward
       const generatedReward = await generateReward(currentLevel.clef, finalScore, currentLevel.name);
       setRewardData(generatedReward);
       
       // Create a new Doll
       const newDoll: Doll = {
         id: Date.now().toString(),
         name: generatedReward.nickname,
         description: generatedReward.funFact,
         // Use picsum with a random seed for consistent but random images
         imageUrl: `https://picsum.photos/seed/${Date.now()}/400/400`, 
         dateUnlocked: new Date().toISOString()
       };
       setUnlockedDolls(prev => [newDoll, ...prev]);
    }
    setLoadingReward(false);
  };

  const handleUpdateDoll = (id: string, newImageUrl: string) => {
    setUnlockedDolls(prev => prev.map(d => d.id === id ? { ...d, imageUrl: newImageUrl } : d));
  };

  // Render Functions
  const renderMenu = () => {
    const clefs = [
      { type: ClefType.TREBLE, label: '高音譜號' },
      { type: ClefType.BASS, label: '低音譜號' },
      { type: ClefType.ALTO, label: '中音譜號' },
      { type: ClefType.TENOR, label: '次中音譜號' },
    ];

    const filteredLevels = LEVELS.filter(l => l.clef === selectedMenuClef);

    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
            樂理大冒險
          </h1>
          <p className="text-gray-600 text-lg">選擇譜號與難度，收集可愛公仔，成為五線譜大師！</p>
          <button 
            onClick={() => setGameState(GameState.COLLECTION)}
            className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition"
          >
            🏆 查看我的收藏 ({unlockedDolls.length})
          </button>
        </header>

        {/* Clef Selection Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {clefs.map((c) => (
            <button
              key={c.type}
              onClick={() => setSelectedMenuClef(c.type)}
              className={`px-6 py-3 rounded-full font-bold transition-all shadow-sm ${
                selectedMenuClef === c.type
                  ? 'bg-indigo-600 text-white scale-105 shadow-indigo-200 shadow-lg'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
          {filteredLevels.map(level => (
            <div key={level.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 flex flex-col">
              <div className={`h-3 w-full ${
                level.difficulty === 'Easy' ? 'bg-green-400' : 
                level.difficulty === 'Medium' ? 'bg-orange-400' : 'bg-red-500'
              }`} />
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                     level.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 
                     level.difficulty === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {level.difficulty}
                  </span>
                  <span className="text-xs font-bold text-gray-400">
                    {level.notesRange.max - level.notesRange.min + 1} 個音符
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{level.name.split('(')[0]}</h3>
                <p className="text-gray-500 text-sm mb-6 flex-1">{level.description}</p>
                <button 
                  onClick={() => startGame(level)}
                  className={`w-full font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-white ${
                    level.difficulty === 'Easy' ? 'bg-green-500 hover:bg-green-600' : 
                    level.difficulty === 'Medium' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  開始挑戰 ▶
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderGame = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 md:p-10 relative">
        {/* Header Stats */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">LEVEL {currentLevel?.id}</p>
            <h2 className="text-xl font-bold text-gray-800">{currentLevel?.name}</h2>
          </div>
          <div className="flex gap-4">
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-xs text-blue-400 font-bold block">SCORE</span>
              <span className="text-xl font-bold text-blue-600">{score}</span>
            </div>
            <div className="bg-purple-50 px-4 py-2 rounded-lg">
              <span className="text-xs text-purple-400 font-bold block">LEFT</span>
              <span className="text-xl font-bold text-purple-600">
                {currentLevel ? currentLevel.totalQuestions - questionCount : 0}
              </span>
            </div>
          </div>
        </div>

        {/* Staff Visualization */}
        <div className="mb-10 relative">
           <Staff clef={currentLevel?.clef || ClefType.TREBLE} noteIndex={currentNoteIndex} />
           
           {/* Feedback Overlay */}
           {feedback && (
             <div className={`absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl transition-all duration-300`}>
               {feedback === 'Correct' ? (
                 <div className="text-green-500 text-6xl animate-bounce">✓</div>
               ) : (
                 <div className="text-red-500 text-6xl animate-pulse">✗</div>
               )}
             </div>
           )}
        </div>

        {/* Controls */}
        <div className="grid grid-cols-7 gap-2 md:gap-4">
          {NOTE_NAMES.map((note) => (
            <button
              key={note}
              onClick={() => handleAnswer(note)}
              disabled={feedback !== null}
              className={`
                aspect-square rounded-2xl font-bold text-xl md:text-2xl shadow-md transition-all
                ${feedback === null 
                  ? 'bg-white border-b-4 border-gray-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:-translate-y-1 active:border-b-0 active:translate-y-1' 
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed border-gray-100'
                }
              `}
            >
              {note}
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => setGameState(GameState.MENU)}
          className="absolute top-4 right-4 md:hidden text-gray-300 hover:text-gray-500"
        >
          ✕
        </button>
      </div>
      
      <div className="mt-8">
        <button 
          onClick={() => setGameState(GameState.MENU)}
          className="text-gray-400 hover:text-gray-600 underline text-sm"
        >
          放棄並返回主選單
        </button>
      </div>
    </div>
  );

  const renderLevelComplete = () => {
    const isWin = currentLevel && score >= currentLevel.requiredScore;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 to-purple-600">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-fade-in-up">
          {loadingReward ? (
             <div className="py-20">
               <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
               <p className="text-gray-500">正在準備你的獎勵...</p>
             </div>
          ) : (
            <>
              <div className="text-6xl mb-4">
                {isWin ? '🎉' : '💪'}
              </div>
              <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
                {isWin ? '挑戰成功！' : '再接再厲！'}
              </h2>
              <p className="text-gray-500 mb-6">
                得分: <span className="text-2xl font-bold text-indigo-600">{score}</span>
                <span className="text-sm mx-2">/</span>
                目標: {currentLevel?.requiredScore}
              </p>

              {isWin && rewardData && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-8 transform rotate-1">
                  <p className="text-xs font-bold text-yellow-600 uppercase mb-2">NEW TITLE UNLOCKED</p>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">「{rewardData.nickname}」</h3>
                  <p className="text-sm text-gray-600 italic">"{rewardData.funFact}"</p>
                  <div className="mt-4 pt-4 border-t border-yellow-200">
                     <p className="text-xs text-gray-400 mb-2">獲得獎勵公仔</p>
                     <img 
                       src={unlockedDolls[0]?.imageUrl} 
                       alt="Reward" 
                       className="w-24 h-24 rounded-lg mx-auto shadow-md object-cover" 
                     />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setGameState(GameState.MENU)}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition"
                >
                  回主選單
                </button>
                {!isWin && currentLevel && (
                  <button
                    onClick={() => startGame(currentLevel)}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition"
                  >
                    再試一次
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-sky-50 font-sans text-gray-800">
      {gameState === GameState.MENU && renderMenu()}
      {gameState === GameState.PLAYING && renderGame()}
      {gameState === GameState.LEVEL_COMPLETE && renderLevelComplete()}
      {gameState === GameState.COLLECTION && (
        <Collection dolls={unlockedDolls} onBack={() => setGameState(GameState.MENU)} onUpdateDoll={handleUpdateDoll} />
      )}
    </div>
  );
};

export default App;