import { useState, useEffect } from "react";
import { Trophy, Medal, Award, X } from "lucide-react";
import { Button } from "./ui/button";

interface LeaderboardEntry {
  rank: number;
  playerName: string;
  score: number;
  timestamp: string;
}

interface LeaderboardProps {
  gameMode: string;
  isOpen: boolean;
  onClose: () => void;
}

// localStorage를 사용한 데이터 관리
const STORAGE_KEY = 'guitar-codes-scores';

function getScores() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('점수 데이터 읽기 오류:', error);
    return {};
  }
}

// 게임 모드별 한국어 이름 매핑
const getGameModeName = (mode: string) => {
  const gameNames: { [key: string]: string } = {
    'chord-input': '코드 입력 게임',
    'fretboard-match': '프렛보드 매칭 게임',
    'note-match': '음표 매칭 게임'
  };
  return gameNames[mode] || mode;
};

export function Leaderboard({ gameMode, isOpen, onClose }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen, gameMode]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      console.log('리더보드 조회 시도:', gameMode);
      
      const scores = getScores();
      
      if (!scores[gameMode]) {
        console.log('게임 모드에 점수 없음:', gameMode);
        setLeaderboard([]);
        return;
      }
      
      const leaderboard = scores[gameMode]
        .slice(0, 20)
        .map((score: any, index: number) => ({
          rank: index + 1,
          playerName: score.playerName,
          score: score.score,
          timestamp: score.timestamp
        }));
      
      console.log('리더보드 조회 응답:', leaderboard);
      setLeaderboard(leaderboard);
    } catch (error) {
      console.error('리더보드 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-gray-500 font-bold">{rank}</span>;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">리더보드</h2>
            <p className="text-sm text-gray-600 mt-1">{getGameModeName(gameMode)}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* 리더보드 내용 */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-2 text-gray-600">로딩 중...</span>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">아직 기록이 없습니다.</p>
              <p className="text-sm text-gray-400">첫 번째 기록을 만들어보세요!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.rank}
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                    index < 3 
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-800">
                          {entry.playerName}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {getGameModeName(gameMode)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(entry.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-purple-600">
                      {entry.score.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">점</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-center p-6 border-t bg-gray-50">
          <Button onClick={onClose} className="px-8">
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}
