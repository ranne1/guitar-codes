const fs = require('fs');
const path = require('path');

// 데이터 파일 경로
const DATA_FILE = path.join(process.cwd(), 'data', 'scores.json');

// 데이터 읽기 함수
function readScores() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return {};
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('데이터 읽기 오류:', error);
    return {};
  }
}

export default function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // 리더보드 조회
    const { gameMode } = req.query;
    const limit = parseInt(req.query.limit) || 10;
    
    console.log('리더보드 조회 요청:', gameMode, 'limit:', limit);
    
    const scores = readScores();
    
    if (!scores[gameMode]) {
      console.log('게임 모드에 점수 없음:', gameMode);
      return res.json({ leaderboard: [] });
    }
    
    const leaderboard = scores[gameMode]
      .slice(0, limit)
      .map((score, index) => ({
        rank: index + 1,
        playerName: score.playerName,
        score: score.score,
        timestamp: score.timestamp
      }));
    
    console.log('리더보드 응답:', leaderboard);
    res.json({ leaderboard });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
