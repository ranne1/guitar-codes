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

// 데이터 저장 함수
function saveScores(scores) {
  try {
    // data 디렉토리가 없으면 생성
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(scores, null, 2));
  } catch (error) {
    console.error('데이터 저장 오류:', error);
  }
}

export default function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    // 점수 저장
    const { gameMode, playerName, score } = req.body;
    
    console.log('점수 저장 요청:', { gameMode, playerName, score });
    
    if (!gameMode || score === undefined) {
      return res.status(400).json({ error: 'gameMode와 score는 필수입니다.' });
    }
    
    const scores = readScores();
    
    // 게임 모드별 점수 배열 초기화
    if (!scores[gameMode]) {
      scores[gameMode] = [];
      console.log('새 게임 모드 생성:', gameMode);
    }
    
    // 현재 최고점 확인
    const currentBest = scores[gameMode].length > 0 
      ? Math.max(...scores[gameMode].map(s => s.score)) 
      : 0;
    
    const isNewRecord = score > currentBest;
    console.log('현재 최고점:', currentBest, '새 점수:', score, '신기록 여부:', isNewRecord);
    
    // 새 점수 추가
    const newScore = {
      id: Date.now(),
      playerName: playerName || 'Anonymous',
      score: score,
      timestamp: new Date().toISOString()
    };
    
    scores[gameMode].push(newScore);
    
    // 점수 순으로 정렬 (높은 점수부터)
    scores[gameMode].sort((a, b) => b.score - a.score);
    
    // 상위 100개만 유지
    if (scores[gameMode].length > 100) {
      scores[gameMode] = scores[gameMode].slice(0, 100);
    }
    
    saveScores(scores);
    
    // 순위 계산
    const rank = scores[gameMode].findIndex(s => s.id === newScore.id) + 1;
    
    res.json({
      success: true,
      isNewRecord,
      previousBest: currentBest,
      newScore: score,
      rank: rank,
      playerName: newScore.playerName
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
