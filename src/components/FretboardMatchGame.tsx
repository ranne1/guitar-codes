import { useState, useEffect } from "react";
import { GuitarChordCard } from "./GuitarChordCard";
import { ChordNameCard } from "./ChordNameCard";
import { Button } from "./ui/button";
import { ArrowLeft, RotateCcw, Music, Trophy, Square } from "lucide-react";
import { useScoreSystem, ScoreDisplay, ResultDisplay } from "./ScoreSystem";
import { Leaderboard } from "./Leaderboard";

interface ChordData {
  id: string;
  name: string;
  frets: (number | null)[];
  fingers: (number | null)[]; // 6개 현에 대응하는 손가락 번호 (1-4), null은 뮤트나 개방현
}

interface FretboardMatchGameProps {
  onBack: () => void;
}

export function FretboardMatchGame({ onBack }: FretboardMatchGameProps) {
  const [selectedChord, setSelectedChord] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [matches, setMatches] = useState<Set<string>>(new Set());
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [gameChords, setGameChords] = useState<ChordData[]>([]);
  const [gameChordNames, setGameChordNames] = useState<string[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  const scoreSystem = useScoreSystem("fretboard-match", 10);

  // 기본코드 21개 (메이저 7개, 마이너 7개, 7th 7개)
  // 배열 순서: [1번줄(High E), 2번줄(B), 3번줄(G), 4번줄(D), 5번줄(A), 6번줄(Low E)]
  const chords: ChordData[] = [
    // 메이저 코드 (7개)
    { 
      id: "C", 
      name: "C", 
      frets: [0, 1, 0, 2, 3, null], 
      fingers: [null, 1, null, 2, 3, null] 
    },
    { 
      id: "D", 
      name: "D", 
      frets: [2, 3, 2, 0, null, null], 
      fingers: [1, 3, 2, null, null, null] 
    },
    { 
      id: "E", 
      name: "E", 
      frets: [0, 0, 1, 2, 2, 0], 
      fingers: [null, null, 1, 2, 3, null] 
    },
    { 
      id: "F", 
      name: "F", 
      frets: [1, 1, 2, 3, 3, 1], 
      fingers: [1, 1, 2, 3, 4, 1] 
    },
    { 
      id: "G", 
      name: "G", 
      frets: [3, 0, 0, 0, 2, 3], 
      fingers: [3, null, null, null, 2, 4] 
    },
    { 
      id: "A", 
      name: "A", 
      frets: [0, 2, 2, 2, 0, null], 
      fingers: [null, 1, 2, 3, null, null] 
    },
    { 
      id: "B", 
      name: "B", 
      frets: [2, 4, 4, 4, 2, null], 
      fingers: [1, 2, 3, 4, 1, null] 
    },

    // 마이너 코드 (7개)
    { 
      id: "Cm", 
      name: "Cm", 
      frets: [null, 1, 1, 3, 4, 3], 
      fingers: [null, 1, 1, 2, 4, 3] 
    },
    { 
      id: "Dm", 
      name: "Dm", 
      frets: [1, 3, 2, 0, null, null], 
      fingers: [1, 4, 2, null, null, null] 
    },
    { 
      id: "Em", 
      name: "Em", 
      frets: [0, 0, 0, 2, 2, 0], 
      fingers: [null, null, null, 2, 3, null] 
    },
    { 
      id: "Fm", 
      name: "Fm", 
      frets: [1, 1, 1, 3, 3, 1], 
      fingers: [1, 1, 1, 3, 4, 1] 
    },
    { 
      id: "Gm", 
      name: "Gm", 
      frets: [3, 1, 1, 3, 3, 3], 
      fingers: [3, 1, 1, 2, 4, 3] 
    },
    { 
      id: "Am", 
      name: "Am", 
      frets: [0, 1, 2, 2, 0, null], 
      fingers: [null, 1, 2, 3, null, null] 
    },
    { 
      id: "Bm", 
      name: "Bm", 
      frets: [2, 3, 4, 4, 2, null], 
      fingers: [1, 2, 3, 4, 1, null] 
    },

    // 7th 코드 (7개)
    { 
      id: "C7", 
      name: "C7", 
      frets: [0, 1, 3, 2, 3, null], 
      fingers: [null, 1, 4, 2, 3, null] 
    },
    { 
      id: "D7", 
      name: "D7", 
      frets: [2, 1, 2, 0, null, null], 
      fingers: [2, 1, 3, null, null, null] 
    },
    { 
      id: "E7", 
      name: "E7", 
      frets: [0, 0, 1, 0, 2, 0], 
      fingers: [null, null, 1, null, 2, null] 
    },
    { 
      id: "F7", 
      name: "F7", 
      frets: [1, 1, 2, 1, 3, 1], 
      fingers: [1, 1, 2, 1, 3, 1] 
    },
    { 
      id: "G7", 
      name: "G7", 
      frets: [1, 0, 0, 0, 2, 3], 
      fingers: [1, null, null, null, 2, 3] 
    },
    { 
      id: "A7", 
      name: "A7", 
      frets: [0, 2, 0, 2, 0, null], 
      fingers: [null, 2, null, 3, null, null] 
    },
    { 
      id: "B7", 
      name: "B7", 
      frets: [null, 1, 3, 2, 4, null], 
      fingers: [null, 1, 3, 2, 4, null] 
    }
  ];

  // 게임 시작 시 랜덤으로 8개 코드 선택
  const initializeGame = () => {
    const shuffledChords = [...chords].sort(() => Math.random() - 0.5);
    const selectedChords = shuffledChords.slice(0, 8);
    const selectedNames = selectedChords.map(chord => chord.name).sort(() => Math.random() - 0.5);
    
    setGameChords(selectedChords);
    setGameChordNames(selectedNames);
    setMatches(new Set());
    setSelectedChord(null);
    setSelectedName(null);
    setIsGameCompleted(false);
  };

  // 컴포넌트 마운트 시 게임 초기화
  useEffect(() => {
    initializeGame();
  }, []);

  const handleChordSelect = (chordId: string) => {
    if (matches.has(chordId)) return;
    setSelectedChord(selectedChord === chordId ? null : chordId);
    
    // 새로운 선택이면 타이머 시작
    if (selectedChord !== chordId && !selectedName) {
      scoreSystem.startTimer();
    }
  };

  const handleNameSelect = (chordName: string) => {
    if (matches.has(chordName)) return;
    setSelectedName(selectedName === chordName ? null : chordName);
    
    // 새로운 선택이면 타이머 시작
    if (selectedName !== chordName && !selectedChord) {
      scoreSystem.startTimer();
    }
  };

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
            gameMode: 'fretboard-match', 
            score: scoreSystem.totalScore, 
            playerName: scoreSystem.playerName || '익명' 
          }),
        });
        console.log('게임 종료 - 점수 저장됨:', scoreSystem.totalScore);
      } catch (error) {
        console.error("Failed to save score:", error);
      }
    }
    setIsGameCompleted(true);
  };

  useEffect(() => {
    if (selectedChord && selectedName) {
      const chord = gameChords.find(c => c.id === selectedChord);
      if (chord && chord.name === selectedName) {
        // 정답!
        const earnedScore = scoreSystem.handleCorrectAnswer();
        setTimeout(() => {
          setMatches(prev => new Set([...prev, selectedChord, selectedName]));
          setSelectedChord(null);
          setSelectedName(null);
        }, 500);
      } else {
        // 틀렸을 때
        scoreSystem.handleWrongAnswer();
        setTimeout(() => {
          setSelectedChord(null);
          setSelectedName(null);
        }, 1000);
      }
    }
  }, [selectedChord, selectedName, gameChords, scoreSystem]);

  // 게임 완료 체크
  useEffect(() => {
    if (gameChords.length > 0 && matches.size === gameChords.length * 2 && !isGameCompleted) {
      setIsGameCompleted(true);
      const isNewRecord = scoreSystem.completeRound(scoreSystem.totalScore);
      console.log('게임 완료! 신기록:', isNewRecord, '총점:', scoreSystem.totalScore);
    }
  }, [matches.size, gameChords.length, isGameCompleted, scoreSystem]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            돌아가기
          </Button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold">짝짓기 (지판)</h1>
            <p className="text-sm text-muted-foreground">빠르게 정답을 맞춰 높은 점수를 얻어보세요!</p>
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
            <Button variant="outline" onClick={resetGame} className="flex items-center gap-2">
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

        {/* 게임 영역 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 왼쪽: 기타 코드 지판들 */}
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-medium mb-4 text-center">기타 코드 지판</h2>
            <div className="space-y-3 w-full max-w-[280px]">
              {gameChords.map((chord) => (
                <GuitarChordCard
                  key={chord.id}
                  chord={chord}
                  isSelected={selectedChord === chord.id}
                  onClick={() => handleChordSelect(chord.id)}
                />
              ))}
            </div>
          </div>

          {/* 오른쪽: 코드명들 */}
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-medium mb-4 text-center">코드명</h2>
            <div className="space-y-3 w-full max-w-[280px]">
              {gameChordNames.map((chordName) => (
                <ChordNameCard
                  key={chordName}
                  chordName={chordName}
                  isSelected={selectedName === chordName}
                  isMatched={matches.has(chordName)}
                  onClick={() => handleNameSelect(chordName)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 설명 */}
        <div className="mt-8 p-4 bg-white rounded-lg border">
          <h3 className="font-medium mb-2">게임 방법</h3>
          <p className="text-sm text-muted-foreground mb-2">
            왼쪽의 기타 코드 지판과 오른쪽의 코드명을 매치하세요.
          </p>
          <p className="text-xs text-gray-500">
            ⏱️ 빠를수록 높은 점수! 1초 이내: 100점, 2초 이내: 90점... 10초 이후: 10점
          </p>
        </div>

        {/* 게임 종료 버튼 */}
        {!isGameCompleted && (
          <div className="mt-6 text-center">
            <Button 
              onClick={endGame}
              variant="destructive"
              className="px-6 py-2"
            >
              <Square className="w-4 h-4 mr-2" />
              게임종료
            </Button>
          </div>
        )}

        {/* 결과 모달 */}
        {isGameCompleted && (
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
          gameMode="fretboard-match"
          isOpen={showLeaderboard}
          onClose={() => setShowLeaderboard(false)}
        />
      </div>
    </div>
  );
}