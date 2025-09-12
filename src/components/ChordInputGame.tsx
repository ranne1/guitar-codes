import { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw, Trophy, Check, X, Square } from "lucide-react";
import { Button } from "./ui/button";
import { useScoreSystem, ScoreDisplay, ResultDisplay } from "./ScoreSystem";
import { Leaderboard } from "./Leaderboard";

interface FretPosition {
  string: number; // 1-6 (6번줄이 가장 두꺼운 줄)
  fret: number;   // 0-12 (0은 개방현)
}

interface ChordPattern {
  name: string;
  positions: FretPosition[];
  description: string;
}

interface ChordInputGameProps {
  onBack: () => void;
}

// 기본코드 21개 (메이저 7개, 마이너 7개, 7th 7개)
const allChordPatterns: ChordPattern[] = [
  // 메이저 코드 (7개)
  {
    name: "C",
    positions: [
      { string: 2, fret: 1 }, // B줄 1프렛
      { string: 4, fret: 2 }, // D줄 2프렛
      { string: 5, fret: 3 }, // A줄 3프렛
    ],
    description: "C 코드"
  },
  {
    name: "D",
    positions: [
      { string: 1, fret: 2 }, // E줄 2프렛
      { string: 2, fret: 3 }, // B줄 3프렛
      { string: 3, fret: 2 }, // G줄 2프렛
    ],
    description: "D 코드"
  },
  {
    name: "E",
    positions: [
      { string: 3, fret: 1 }, // G줄 1프렛
      { string: 4, fret: 2 }, // D줄 2프렛
      { string: 5, fret: 2 }, // A줄 2프렛
    ],
    description: "E 코드"
  },
  {
    name: "F",
    positions: [
      { string: 1, fret: 1 }, // E줄 1프렛
      { string: 2, fret: 1 }, // B줄 1프렛
      { string: 3, fret: 2 }, // G줄 2프렛
      { string: 4, fret: 3 }, // D줄 3프렛
      { string: 5, fret: 3 }, // A줄 3프렛
      { string: 6, fret: 1 }, // E줄 1프렛
    ],
    description: "F 코드 (바레코드)"
  },
  {
    name: "G",
    positions: [
      { string: 1, fret: 3 }, // E줄 3프렛
      { string: 5, fret: 2 }, // A줄 2프렛
      { string: 6, fret: 3 }, // E줄 3프렛
    ],
    description: "G 코드"
  },
  {
    name: "A",
    positions: [
      { string: 2, fret: 2 }, // B줄 2프렛
      { string: 3, fret: 2 }, // G줄 2프렛
      { string: 4, fret: 2 }, // D줄 2프렛
    ],
    description: "A 코드"
  },
  {
    name: "B",
    positions: [
      { string: 1, fret: 2 }, // E줄 2프렛
      { string: 2, fret: 4 }, // B줄 4프렛
      { string: 3, fret: 4 }, // G줄 4프렛
      { string: 4, fret: 4 }, // D줄 4프렛
      { string: 5, fret: 2 }, // A줄 2프렛
    ],
    description: "B 코드"
  },
  
  // 마이너 코드 (7개)
  {
    name: "Cm",
    positions: [
      { string: 2, fret: 1 }, // B줄 1프렛
      { string: 3, fret: 1 }, // G줄 1프렛
      { string: 4, fret: 3 }, // D줄 3프렛
      { string: 5, fret: 4 }, // A줄 4프렛
      { string: 6, fret: 3 }, // E줄 3프렛
    ],
    description: "Cm 코드"
  },
  {
    name: "Dm",
    positions: [
      { string: 1, fret: 1 }, // E줄 1프렛
      { string: 2, fret: 3 }, // B줄 3프렛
      { string: 3, fret: 2 }, // G줄 2프렛
    ],
    description: "Dm 코드"
  },
  {
    name: "Em",
    positions: [
      { string: 4, fret: 2 }, // D줄 2프렛
      { string: 5, fret: 2 }, // A줄 2프렛
    ],
    description: "Em 코드"
  },
  {
    name: "Fm",
    positions: [
      { string: 1, fret: 1 }, // E줄 1프렛
      { string: 2, fret: 1 }, // B줄 1프렛
      { string: 3, fret: 1 }, // G줄 1프렛
      { string: 4, fret: 3 }, // D줄 3프렛
      { string: 5, fret: 3 }, // A줄 3프렛
      { string: 6, fret: 1 }, // E줄 1프렛
    ],
    description: "Fm 코드"
  },
  {
    name: "Gm",
    positions: [
      { string: 1, fret: 3 }, // E줄 3프렛
      { string: 2, fret: 1 }, // B줄 1프렛
      { string: 3, fret: 1 }, // G줄 1프렛
      { string: 4, fret: 3 }, // D줄 3프렛
      { string: 5, fret: 3 }, // A줄 3프렛
      { string: 6, fret: 3 }, // E줄 3프렛
    ],
    description: "Gm 코드"
  },
  {
    name: "Am",
    positions: [
      { string: 2, fret: 1 }, // B줄 1프렛
      { string: 3, fret: 2 }, // G줄 2프렛
      { string: 4, fret: 2 }, // D줄 2프렛
    ],
    description: "Am 코드"
  },
  {
    name: "Bm",
    positions: [
      { string: 1, fret: 2 }, // E줄 2프렛
      { string: 2, fret: 3 }, // B줄 3프렛
      { string: 3, fret: 4 }, // G줄 4프렛
      { string: 4, fret: 4 }, // D줄 4프렛
      { string: 5, fret: 2 }, // A줄 2프렛
    ],
    description: "Bm 코드"
  },
  
  // 7th 코드 (7개)
  {
    name: "C7",
    positions: [
      { string: 2, fret: 1 }, // B줄 1프렛
      { string: 3, fret: 3 }, // G줄 3프렛
      { string: 4, fret: 2 }, // D줄 2프렛
      { string: 5, fret: 3 }, // A줄 3프렛
    ],
    description: "C7 코드"
  },
  {
    name: "D7",
    positions: [
      { string: 1, fret: 2 }, // E줄 2프렛
      { string: 2, fret: 1 }, // B줄 1프렛
      { string: 3, fret: 2 }, // G줄 2프렛
    ],
    description: "D7 코드"
  },
  {
    name: "E7",
    positions: [
      { string: 3, fret: 1 }, // G줄 1프렛
      { string: 5, fret: 2 }, // A줄 2프렛
    ],
    description: "E7 코드"
  },
  {
    name: "F7",
    positions: [
      { string: 1, fret: 1 }, // E줄 1프렛
      { string: 2, fret: 1 }, // B줄 1프렛
      { string: 3, fret: 2 }, // G줄 2프렛
      { string: 4, fret: 1 }, // D줄 1프렛
      { string: 5, fret: 3 }, // A줄 3프렛
      { string: 6, fret: 1 }, // E줄 1프렛
    ],
    description: "F7 코드"
  },
  {
    name: "G7",
    positions: [
      { string: 1, fret: 1 }, // E줄 1프렛
      { string: 5, fret: 2 }, // A줄 2프렛
      { string: 6, fret: 3 }, // E줄 3프렛
    ],
    description: "G7 코드"
  },
  {
    name: "A7",
    positions: [
      { string: 2, fret: 2 }, // B줄 2프렛
      { string: 4, fret: 2 }, // D줄 2프렛
    ],
    description: "A7 코드"
  },
  {
    name: "B7",
    positions: [
      { string: 2, fret: 1 }, // B줄 1프렛
      { string: 3, fret: 3 }, // G줄 3프렛
      { string: 4, fret: 2 }, // D줄 2프렛
      { string: 5, fret: 4 }, // A줄 4프렛
    ],
    description: "B7 코드"
  }

];

export function ChordInputGame({ onBack }: ChordInputGameProps) {
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [playerInput, setPlayerInput] = useState<FretPosition[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameChords, setGameChords] = useState<ChordPattern[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  const scoreSystem = useScoreSystem("chord-input", 15); // 코드 입력은 조금 더 긴 시간

  // 게임 초기화 - 랜덤으로 10개 코드 선택
  const initializeGame = () => {
    const shuffledChords = [...allChordPatterns].sort(() => Math.random() - 0.5);
    const selectedChords = shuffledChords.slice(0, 10);
    setGameChords(selectedChords);
    setCurrentChordIndex(0);
    setPlayerInput([]);
    setShowResult(false);
    setIsCorrect(false);
    setGameCompleted(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const currentChord = gameChords[currentChordIndex];

  const resetGame = () => {
    initializeGame();
    scoreSystem.resetGame();
  };

  // 게임 종료 (중간에 종료)
  const endGame = async () => {
    if (scoreSystem.totalScore > 0) {
      // 현재 점수를 서버에 저장
      try {
        await fetch('http://localhost:3001/api/scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            gameMode: 'chord-input', 
            score: scoreSystem.totalScore, 
            playerName: scoreSystem.playerName || '익명' 
          }),
        });
        console.log('게임 종료 - 점수 저장됨:', scoreSystem.totalScore);
      } catch (error) {
        console.error("Failed to save score:", error);
      }
    }
    setGameCompleted(true);
  };

  const handleFretClick = (string: number, fret: number) => {
    if (showResult) return;

    // 첫 클릭 시 타이머 시작
    if (playerInput.length === 0) {
      scoreSystem.startTimer();
    }

    const position = { string, fret };
    
    // 같은 줄에 이미 입력된 위치가 있으면 제거하고 새로 추가
    const newInput = playerInput.filter(p => p.string !== string);
    
    // 0프렛(개방현)이 아닌 경우에만 추가
    if (fret > 0) {
      newInput.push(position);
    }
    
    setPlayerInput(newInput);
  };

  const checkAnswer = () => {
    const correctPositions = currentChord.positions;
    
    // 입력된 위치와 정답 위치가 정확히 일치하는지 확인
    const isMatch = correctPositions.length === playerInput.length &&
      correctPositions.every(correct => 
        playerInput.some(input => 
          input.string === correct.string && input.fret === correct.fret
        )
      );

    setIsCorrect(isMatch);
    setShowResult(true);
    
    if (isMatch) {
      scoreSystem.handleCorrectAnswer();
    } else {
      scoreSystem.handleWrongAnswer();
    }
  };

  const nextChord = () => {
    if (currentChordIndex < gameChords.length - 1) {
      setCurrentChordIndex(prev => prev + 1);
      setPlayerInput([]);
      setShowResult(false);
      setIsCorrect(false);
    } else {
      setGameCompleted(true);
      scoreSystem.completeRound(scoreSystem.totalScore);
    }
  };

  const tryAgain = () => {
    setPlayerInput([]);
    setShowResult(false);
    setIsCorrect(false);
  };

  // 기타 지판 렌더링
  const renderFretboard = () => {
    const strings = 6;
    const frets = 5;
    const stringNames = ['E', 'B', 'G', 'D', 'A', 'E']; // 1번줄부터 6번줄까지

    return (
      <div className="bg-amber-100 rounded-lg p-6 border-2 border-amber-200">
        {/* 프렛 번호 표시 */}
        <div className="flex mb-4">
          <div className="w-12"></div> {/* 줄 이름 공간 */}
          {Array.from({ length: frets + 1 }, (_, fretIndex) => (
            <div key={fretIndex} className="flex-1 text-center text-sm font-medium text-amber-700">
              {fretIndex}
            </div>
          ))}
        </div>
        
        {/* 기타 지판 */}
        <div className="relative">
          {/* 각 줄별로 가로로 배치 */}
          {stringNames.map((stringName, stringIndex) => {
            const stringNumber = stringIndex + 1;
            const stringThickness = stringNumber === 6 ? 3 : stringNumber === 5 ? 2.5 : 2; // 굵은 줄일수록 두껍게
            
            return (
              <div key={stringIndex} className="flex items-center mb-4 relative">
                {/* 줄 이름 */}
                <div className="w-12 text-right pr-2 text-sm font-medium text-amber-800">
                  {stringName}
                </div>
                
                {/* 기타 줄 (가로선) */}
                <div 
                  className="absolute bg-amber-800 opacity-50"
                  style={{
                    left: '48px',
                    right: '0',
                    height: `${stringThickness}px`,
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                />
                
                {/* 프렛 위치 버튼들 */}
                {Array.from({ length: frets + 1 }, (_, fretIndex) => {
                  const isPressed = playerInput.some(
                    p => p.string === stringNumber && p.fret === fretIndex
                  );
                  
                  return (
                    <button
                      key={fretIndex}
                      onClick={() => handleFretClick(stringNumber, fretIndex)}
                      disabled={showResult}
                      className={`flex-1 h-10 mx-1 rounded-lg border-2 transition-all duration-200 relative z-10 ${
                        isPressed
                          ? 'bg-orange-500 border-orange-600 text-white shadow-lg'
                          : fretIndex === 0
                            ? 'bg-amber-200/60 border-amber-400 hover:border-amber-500 hover:bg-amber-200/80'
                            : 'bg-white/80 border-amber-300 hover:border-amber-400 hover:bg-amber-50 hover:shadow-md'
                      } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {isPressed && (
                        <div className="w-6 h-6 bg-orange-600 rounded-full mx-auto flex items-center justify-center">
                          <span className="text-white text-xs">●</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
          
          {/* 프렛 구분선 */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: frets + 1 }, (_, fretIndex) => (
              <div
                key={fretIndex}
                className="absolute bg-gray-400 opacity-30"
                style={{
                  left: `${48 + (fretIndex * (100 - 12) / frets)}%`,
                  top: '0',
                  width: '1px',
                  height: '100%'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로가기
          </Button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-800">코드 입력</h1>
            <p className="text-sm text-gray-600">빠르게 정답을 맞춰 높은 점수를 얻어보세요!</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowLeaderboard(true)}
              className="flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              리더보드
            </Button>
            <Button 
              variant="outline" 
              onClick={resetGame}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              다시하기
            </Button>
          </div>
        </div>

        {/* 점수 표시 */}
        <ScoreDisplay
          currentScore={scoreSystem.currentScore}
          totalScore={scoreSystem.totalScore}
          bestScore={scoreSystem.bestScore}
          timeLeft={scoreSystem.timeLeft}
          isActive={scoreSystem.isActive}
          isNewRecord={scoreSystem.isNewRecord}
        />

        {!gameCompleted && currentChord && (
          <>
            {/* 현재 코드 정보 */}
            <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentChord.name}</h2>
                <p className="text-gray-600 mb-4">{currentChord.description}</p>
                <div className="text-sm text-gray-500">
                  진행률: {currentChordIndex + 1} / {gameChords.length}
                </div>
              </div>
            </div>

            {/* 기타 지판 */}
            <div className="mb-6">
              {renderFretboard()}
            </div>

            {/* 결과 표시 */}
            {showResult && (
              <div className={`rounded-lg p-4 mb-4 border-2 ${
                isCorrect 
                  ? 'bg-green-100 border-green-300' 
                  : 'bg-red-100 border-red-300'
              }`}>
                <div className="flex items-center justify-center gap-2 mb-3">
                  {isCorrect ? (
                    <>
                      <Check className="w-6 h-6 text-green-600" />
                      <span className="font-bold text-green-800">정답입니다!</span>
                    </>
                  ) : (
                    <>
                      <X className="w-6 h-6 text-red-600" />
                      <span className="font-bold text-red-800">틀렸습니다!</span>
                    </>
                  )}
                </div>
                
                <div className="text-center">
                  {isCorrect ? (
                    <Button onClick={nextChord} className="bg-green-600 hover:bg-green-700">
                      {currentChordIndex < gameChords.length - 1 ? '다음 코드' : '게임 완료'}
                    </Button>
                  ) : (
                    <Button onClick={tryAgain} variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                      다시 시도
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* 확인 버튼과 게임 종료 버튼 */}
            <div className="text-center flex gap-3 justify-center">
              {!showResult && (
                <Button 
                  onClick={checkAnswer}
                  disabled={playerInput.length === 0}
                  className="bg-orange-500 hover:bg-orange-600 px-8 py-2"
                >
                  확인
                </Button>
              )}
              {!gameCompleted && (
                <Button 
                  onClick={endGame}
                  variant="destructive"
                  className="px-6 py-2"
                >
                  <Square className="w-4 h-4 mr-2" />
                  게임종료
                </Button>
              )}
            </div>

            {/* 게임 설명 */}
            <div className="mt-6 p-4 bg-white rounded-lg border">
              <h3 className="font-medium mb-2">게임 방법</h3>
              <p className="text-sm text-muted-foreground mb-2">
                지판의 원하는 위치를 클릭하여 코드를 입력하세요.
              </p>
              <p className="text-xs text-gray-500">
                ⏱️ 빠를수록 높은 점수! 1초 이내: 100점, 2초 이내: 90점... 15초 이후: 10점
              </p>
            </div>
          </>
        )}

        {/* 결과 모달 */}
        {gameCompleted && (
          <ResultDisplay
            totalScore={scoreSystem.totalScore}
            bestScore={scoreSystem.bestScore}
            isNewRecord={scoreSystem.isNewRecord}
            onRestart={resetGame}
            onBack={onBack}
            playerName={scoreSystem.playerName}
            onPlayerNameChange={scoreSystem.setPlayerName}
          />
        )}

        {/* 리더보드 모달 */}
        <Leaderboard
          gameMode="chord-input"
          isOpen={showLeaderboard}
          onClose={() => setShowLeaderboard(false)}
        />
      </div>
    </div>
  );
}