const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());

// 데이터 파일 경로
const DATA_FILE = path.join(__dirname, 'scores.json');

// 초기 데이터 파일 생성
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({}));
}

// 데이터 읽기 함수
function readScores() {
  try {
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
    fs.writeFileSync(DATA_FILE, JSON.stringify(scores, null, 2));
  } catch (error) {
    console.error('데이터 저장 오류:', error);
  }
}

// 최고점 조회 API
app.get('/api/scores/:gameMode', (req, res) => {
  const { gameMode } = req.params;
  const scores = readScores();
  
  console.log('최고점 조회 요청:', gameMode);
  console.log('현재 점수 데이터:', scores);
  
  if (!scores[gameMode] || scores[gameMode].length === 0) {
    console.log('게임 모드에 점수 없음:', gameMode);
    return res.json({ bestScore: 0 });
  }
  
  const bestScore = Math.max(...scores[gameMode].map(score => score.score));
  console.log('계산된 최고점:', bestScore, '게임모드:', gameMode);
  res.json({ bestScore });
});

// 점수 저장 API
app.post('/api/scores', (req, res) => {
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
});

// 리더보드 조회 API
app.get('/api/scores/:gameMode/leaderboard', (req, res) => {
  const { gameMode } = req.params;
  const limit = parseInt(req.query.limit) || 10;
  
  const scores = readScores();
  
  if (!scores[gameMode]) {
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
  
  res.json({ leaderboard });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`API 엔드포인트:`);
  console.log(`  GET  /api/scores/:gameMode - 최고점 조회`);
  console.log(`  POST /api/scores - 점수 저장`);
  console.log(`  GET  /api/scores/:gameMode/leaderboard - 리더보드 조회`);
});