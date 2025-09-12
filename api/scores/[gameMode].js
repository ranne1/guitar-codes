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

  if (req.method === 'GET') {
    // 최고점 조회
    const { gameMode } = req.query;
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
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
