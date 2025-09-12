import { useState, useEffect } from "react";
import { Trophy, Clock, Star } from "lucide-react";
import { Badge } from "./ui/badge";

export interface ScoreSystemProps {
  isActive: boolean;
  onTimeUp?: () => void;
  maxTime?: number;
  gameMode: string;
}

export interface ScoreData {
  currentScore: number;
  totalScore: number;
  bestScore: number;
  timeLeft: number;
  isNewRecord: boolean;
}

// API 호출 함수들
const API_BASE_URL = '/api';

async function fetchBestScore(gameMode: string): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/scores?gameMode=${gameMode}`);
    const data = await response.json();
    return data.bestScore || 0;
  } catch (error) {
    console.error('최고점 조회 오류:', error);
    return 0;
  }
}

async function saveScore(gameMode: string, playerName: string, score: number) {
  try {
    console.log('점수 저장 시도:', { gameMode, playerName, score });
    const response = await fetch(`${API_BASE_URL}/scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameMode,
        playerName,
        score
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('점수 저장 응답:', result);
    return result;
  } catch (error) {
    console.error('점수 저장 오류:', error);
    return { success: false, isNewRecord: false };
  }
}

export function useScoreSystem(gameMode: string, maxTime: number = 10) {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [currentScore, setCurrentScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [playerName, setPlayerName] = useState('');

  // 게임 모드가 변경될 때마다 최고점 로드
  useEffect(() => {
    const loadBestScore = async () => {
      console.log('최고점 로드 시도:', gameMode);
      const score = await fetchBestScore(gameMode);
      console.log('로드된 최고점:', score, '게임모드:', gameMode);
      setBestScore(score);
    };
    loadBestScore();
  }, [gameMode]);

  // 타이머 시작
  const startTimer = () => {
    setStartTime(Date.now());
    setTimeLeft(maxTime);
    setIsActive(true);
  };

  // 타이머 정지
  const stopTimer = () => {
    setIsActive(false);
    setStartTime(null);
  };

  // 정답 처리 (시간에 따른 점수 계산)
  const handleCorrectAnswer = () => {
    if (!startTime) return 0;
    
    const elapsedTime = (Date.now() - startTime) / 1000;
    let score = 10; // 기본 점수
    
    if (elapsedTime <= 1) score = 100; // 1초 이내: 10배
    else if (elapsedTime <= 2) score = 90; // 2초 이내: 9배
    else if (elapsedTime <= 3) score = 80; // 3초 이내: 8배
    else if (elapsedTime <= 4) score = 70; // 4초 이내: 7배
    else if (elapsedTime <= 5) score = 60; // 5초 이내: 6배
    else if (elapsedTime <= 6) score = 50; // 6초 이내: 5배
    else if (elapsedTime <= 7) score = 40; // 7초 이내: 4배
    else if (elapsedTime <= 8) score = 30; // 8초 이내: 3배
    else if (elapsedTime <= 9) score = 20; // 9초 이내: 2배
    else score = 10; // 10초 이후: 1배
    
    setCurrentScore(score);
    setTotalScore(prev => prev + score);
    setIsActive(false);
    
    return score;
  };

  // 틀린 답 처리
  const handleWrongAnswer = () => {
    setCurrentScore(0);
    setIsActive(false);
    return 0;
  };

  // 라운드 완료 처리 (자동으로 이름 입력 받고 저장)
  const completeRound = async (finalScore: number, playerNameInput?: string) => {
    // 이름이 제공되지 않으면 기본값 사용
    const nameToUse = playerNameInput || playerName || 'Anonymous';
    
    // 클라이언트에서도 최고점 비교
    const isNewRecord = finalScore > bestScore;
    
    const result = await saveScore(gameMode, nameToUse, finalScore);
    
    if (result.success) {
      // 서버 응답과 클라이언트 비교 중 하나라도 신기록이면 신기록으로 처리
      const isActuallyNewRecord = result.isNewRecord || isNewRecord;
      setIsNewRecord(isActuallyNewRecord);
      
      if (isActuallyNewRecord) {
        setBestScore(finalScore);
        setPlayerName(nameToUse); // 이름 업데이트
        console.log('신기록 달성!', finalScore, '이전 최고점:', bestScore);
      } else {
        console.log('신기록 아님', finalScore, '현재 최고점:', bestScore);
      }
      return isActuallyNewRecord;
    } else {
      // 서버 저장 실패해도 클라이언트에서 신기록이면 처리
      if (isNewRecord) {
        setIsNewRecord(true);
        setBestScore(finalScore);
        setPlayerName(nameToUse);
        console.log('로컬 신기록 달성!', finalScore, '이전 최고점:', bestScore);
        return true;
      }
      setIsNewRecord(false);
      return false;
    }
  };

  // 게임 초기화
  const resetGame = () => {
    setCurrentScore(0);
    setTotalScore(0);
    setTimeLeft(maxTime);
    setIsActive(false);
    setStartTime(null);
    setIsNewRecord(false);
  };

  // 타이머 업데이트
  useEffect(() => {
    if (!isActive || !startTime) return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, maxTime - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        setIsActive(false);
        setCurrentScore(0);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, startTime, maxTime]);

  return {
    startTimer,
    stopTimer,
    handleCorrectAnswer,
    handleWrongAnswer,
    completeRound,
    resetGame,
    currentScore,
    totalScore,
    bestScore,
    timeLeft,
    isActive,
    isNewRecord,
    playerName,
    setPlayerName
  };
}

// 점수 표시 컴포넌트
interface ScoreDisplayProps {
  currentScore: number;
  totalScore: number;
  bestScore: number;
  timeLeft: number;
  isActive: boolean;
  isNewRecord?: boolean;
}

export function ScoreDisplay({ 
  currentScore, 
  totalScore, 
  bestScore, 
  timeLeft, 
  isActive,
  isNewRecord 
}: ScoreDisplayProps) {
  const getTimeColor = () => {
    if (timeLeft > 7) return "text-green-600";
    if (timeLeft > 4) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreColor = () => {
    if (currentScore >= 80) return "bg-green-500";
    if (currentScore >= 50) return "bg-yellow-500";
    if (currentScore >= 20) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          {/* 타이머 */}
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${getTimeColor()}`} />
            <span className={`font-mono text-lg ${getTimeColor()}`}>
              {timeLeft.toFixed(1)}s
            </span>
          </div>
          
          {/* 현재 점수 */}
          {isActive && currentScore > 0 && (
            <Badge className={`${getScoreColor()} text-white`}>
              +{currentScore}
            </Badge>
          )}
        </div>
        
        {/* 최고점 */}
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-600" />
          <span className="font-medium text-gray-700">
            최고: {bestScore}
          </span>
          {isNewRecord && (
            <Badge className="bg-yellow-500 text-white animate-pulse">
              NEW!
            </Badge>
          )}
        </div>
      </div>
      
      {/* 총점 */}
      <div className="flex items-center gap-2">
        <Star className="w-4 h-4 text-purple-600" />
        <span className="font-medium text-gray-700">
          총점: <span className="text-lg font-bold text-purple-600">{totalScore}</span>
        </span>
      </div>
    </div>
  );
}

// 최종 결과 표시 컴포넌트
interface ResultDisplayProps {
  totalScore: number;
  bestScore: number;
  isNewRecord: boolean;
  onRestart: () => void;
  onBack: () => void;
  playerName: string;
  onPlayerNameChange: (name: string) => void;
}

export function ResultDisplay({ 
  totalScore, 
  bestScore, 
  isNewRecord, 
  onRestart, 
  onBack,
  playerName,
  onPlayerNameChange
}: ResultDisplayProps) {
  const [showNameInput, setShowNameInput] = useState(true); // 자동으로 이름 입력 표시
  const [tempName, setTempName] = useState(playerName || '');

  const handleNameSubmit = () => {
    onPlayerNameChange(tempName);
    setShowNameInput(false);
    // 이름이 변경되면 자동으로 점수 저장
    if (tempName.trim()) {
      // 부모 컴포넌트에서 completeRound를 다시 호출하도록 알림
      // 이는 부모 컴포넌트에서 처리해야 함
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
        {isNewRecord && (
          <div className="mb-4 animate-bounce">
            <div className="text-6xl mb-2">🎉</div>
            <h3 className="text-2xl font-bold text-yellow-600 mb-1">신기록 달성!</h3>
            <p className="text-gray-600 text-lg">축하합니다! 새로운 최고점을 기록했습니다!</p>
          </div>
        )}
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">게임 완료</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">이번 점수</span>
              <span className="text-xl font-bold text-purple-600">{totalScore}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-gray-600">최고 점수</span>
              <span className="text-xl font-bold text-yellow-600">{bestScore}</span>
            </div>
          </div>

          {/* 플레이어 이름 입력 */}
          <div className="mt-4">
            {!showNameInput ? (
              <div className="flex items-center justify-center gap-2">
                <span className="text-gray-600">플레이어:</span>
                <span className="font-medium">{playerName || 'Anonymous'}</span>
                <button
                  onClick={() => setShowNameInput(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  변경
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="닉네임을 입력하세요"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={20}
                />
                <button
                  onClick={handleNameSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  확인
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onRestart}
            className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            다시 하기
          </button>
          <button
            onClick={onBack}
            className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            메인으로
          </button>
        </div>
      </div>
    </div>
  );
}