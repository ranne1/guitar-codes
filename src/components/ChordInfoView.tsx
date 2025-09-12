import { useState } from "react";
import { ArrowLeft, Music, Search, BookOpen, Info, Trophy } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Leaderboard } from "./Leaderboard";

interface FretPosition {
  string: number; // 1-6 (6번줄이 가장 두꺼운 줄)
  fret: number;   // 0-12 (0은 개방현)
}

interface ChordInfo {
  name: string;
  fullName: string;
  positions: FretPosition[];
  difficulty: "초급" | "중급" | "고급";
  notes: string[];
  description: string;
  tips: string[];
  category: "메이저" | "마이너" | "세븐스" | "바레" | "기타";
}

interface ChordInfoViewProps {
  onBack: () => void;
}

// 기본코드 21개 정보 데이터 (메이저 7개, 마이너 7개, 7th 7개)
const chordDatabase: ChordInfo[] = [
  // 메이저 코드 (7개)
  {
    name: "C",
    fullName: "C Major",
    positions: [
      { string: 2, fret: 1 }, // B줄 1프렛
      { string: 4, fret: 2 }, // D줄 2프렛
      { string: 5, fret: 3 }, // A줄 3프렛
    ],
    difficulty: "초급",
    notes: ["C", "E", "G"],
    description: "가장 기본적인 메이저 코드로, 많은 곡에서 사용됩니다.",
    tips: [
      "손가락을 세워서 정확히 누르세요",
      "1, 3, 6번줄은 개방현입니다"
    ],
    category: "메이저"
  },
  {
    name: "D",
    fullName: "D Major",
    positions: [
      { string: 1, fret: 2 }, // E줄 2프렛
      { string: 2, fret: 3 }, // B줄 3프렛
      { string: 3, fret: 2 }, // G줄 2프렛
    ],
    difficulty: "초급",
    notes: ["D", "F#", "A"],
    description: "밝고 화사한 느낌의 메이저 코드입니다.",
    tips: [
      "4, 5, 6번줄은 치지 마세요",
      "손가락들이 서로 겹치지 않게 하세요"
    ],
    category: "메이저"
  },
  {
    name: "E",
    fullName: "E Major",
    positions: [
      { string: 3, fret: 1 }, // G줄 1프렛
      { string: 4, fret: 2 }, // D줄 2프렛
      { string: 5, fret: 2 }, // A줄 2프렛
    ],
    difficulty: "초급",
    notes: ["E", "G#", "B"],
    description: "파워풀한 소리의 메이저 코드입니다.",
    tips: [
      "1, 2, 6번줄은 개방현입니다",
      "모든 줄을 힘차게 연주하세요"
    ],
    category: "메이저"
  },
  {
    name: "F",
    fullName: "F Major",
    positions: [
      { string: 1, fret: 1 }, // E줄 1프렛
      { string: 2, fret: 1 }, // B줄 1프렛
      { string: 3, fret: 2 }, // G줄 2프렛
      { string: 4, fret: 3 }, // D줄 3프렛
      { string: 5, fret: 3 }, // A줄 3프렛
      { string: 6, fret: 1 }, // E줄 1프렛
    ],
    difficulty: "중급",
    notes: ["F", "A", "C"],
    description: "첫 번째 바레 코드로, 검지로 여러 줄을 눌러야 합니다.",
    tips: [
      "검지로 1, 2, 6번줄을 바레하세요",
      "꾸준한 연습이 필요한 코드입니다"
    ],
    category: "바레"
  },
  {
    name: "G",
    fullName: "G Major",
    positions: [
      { string: 1, fret: 3 }, // E줄 3프렛
      { string: 5, fret: 2 }, // A줄 2프렛
      { string: 6, fret: 3 }, // E줄 3프렛
    ],
    difficulty: "초급",
    notes: ["G", "B", "D"],
    description: "밝고 명랑한 느낌의 메이저 코드입니다.",
    tips: [
      "1번과 6번줄을 3프렛으로 누르세요",
      "2, 3, 4번줄은 개방현입니다"
    ],
    category: "메이저"
  },
  {
    name: "A",
    fullName: "A Major",
    positions: [
      { string: 2, fret: 2 }, // B줄 2프렛
      { string: 3, fret: 2 }, // G줄 2프렛
      { string: 4, fret: 2 }, // D줄 2프렛
    ],
    difficulty: "초급",
    notes: ["A", "C#", "E"],
    description: "세 손가락으로 2프렛을 누르는 코드입니다.",
    tips: [
      "2, 3, 4번줄을 2프렛으로 누르세요",
      "1, 5번줄은 개방현입니다"
    ],
    category: "메이저"
  },
  {
    name: "B",
    fullName: "B Major",
    positions: [
      { string: 1, fret: 2 }, // E줄 2프렛
      { string: 2, fret: 4 }, // B줄 4프렛
      { string: 3, fret: 4 }, // G줄 4프렛
      { string: 4, fret: 4 }, // D줄 4프렛
      { string: 5, fret: 2 }, // A줄 2프렛
    ],
    difficulty: "중급",
    notes: ["B", "D#", "F#"],
    description: "바레 코드 형태의 메이저 코드입니다.",
    tips: [
      "2프렛에서 바레를 하세요",
      "4프렛에서 여러 줄을 누르세요"
    ],
    category: "바레"
  },

  // 마이너 코드 (7개)
  {
    name: "Cm",
    fullName: "C Minor",
    positions: [
      { string: 2, fret: 1 }, // B줄 1프렛
      { string: 3, fret: 1 }, // G줄 1프렛
      { string: 4, fret: 3 }, // D줄 3프렛
      { string: 5, fret: 4 }, // A줄 4프렛
      { string: 6, fret: 3 }, // E줄 3프렛
    ],
    difficulty: "중급",
    notes: ["C", "Eb", "G"],
    description: "슬픈 느낌의 마이너 코드입니다.",
    tips: [
      "바레 코드 형태입니다",
      "정확한 손가락 위치가 중요합니다"
    ],
    category: "마이너"
  },
  {
    name: "Dm",
    fullName: "D Minor",
    positions: [
      { string: 1, fret: 1 }, // E줄 1프렛
      { string: 2, fret: 3 }, // B줄 3프렛
      { string: 3, fret: 2 }, // G줄 2프렛
    ],
    difficulty: "초급",
    notes: ["D", "F", "A"],
    description: "서정적인 느낌의 마이너 코드입니다.",
    tips: [
      "D메이저와 비슷하지만 1번줄이 1프렛입니다",
      "4, 5, 6번줄은 치지 마세요"
    ],
    category: "마이너"
  },
  {
    name: "Em",
    fullName: "E Minor",
    positions: [
      { string: 4, fret: 2 }, // D줄 2프렛
      { string: 5, fret: 2 }, // A줄 2프렛
    ],
    difficulty: "초급",
    notes: ["E", "G", "B"],
    description: "가장 쉬운 기타 코드입니다.",
    tips: [
      "두 개의 손가락만 사용합니다",
      "나머지 줄들은 모두 개방현입니다"
    ],
    category: "마이너"
  },
  {
    name: "Fm",
    fullName: "F Minor",
    positions: [
      { string: 1, fret: 1 }, // E줄 1프렛
      { string: 2, fret: 1 }, // B줄 1프렛
      { string: 3, fret: 1 }, // G줄 1프렛
      { string: 4, fret: 3 }, // D줄 3프렛
      { string: 5, fret: 3 }, // A줄 3프렛
      { string: 6, fret: 1 }, // E줄 1프렛
    ],
    difficulty: "중급",
    notes: ["F", "Ab", "C"],
    description: "바레 코드 형태의 마이너 코드입니다.",
    tips: [
      "1프렛에서 바레를 하세요",
      "F메이저와 비슷하지만 3번줄도 1프렛입니다"
    ],
    category: "바레"
  },
  {
    name: "Gm",
    fullName: "G Minor",
    positions: [
      { string: 1, fret: 3 }, // E줄 3프렛
      { string: 2, fret: 1 }, // B줄 1프렛
      { string: 3, fret: 1 }, // G줄 1프렛
      { string: 4, fret: 3 }, // D줄 3프렛
      { string: 5, fret: 3 }, // A줄 3프렛
      { string: 6, fret: 3 }, // E줄 3프렛
    ],
    difficulty: "중급",
    notes: ["G", "Bb", "D"],
    description: "바레 코드 형태의 마이너 코드입니다.",
    tips: [
      "3프렛에서 바레를 하세요",
      "복잡한 손가락 배치가 필요합니다"
    ],
    category: "바레"
  },
  {
    name: "Am",
    fullName: "A Minor",
    positions: [
      { string: 2, fret: 1 }, // B줄 1프렛
      { string: 3, fret: 2 }, // G줄 2프렛
      { string: 4, fret: 2 }, // D줄 2프렛
    ],
    difficulty: "초급",
    notes: ["A", "C", "E"],
    description: "가장 쉬운 마이너 코드입니다.",
    tips: [
      "2번과 3번 손가락으로 2프렛을 누르세요",
      "1, 5, 6번줄은 개방현입니다"
    ],
    category: "마이너"
  },
  {
    name: "Bm",
    fullName: "B Minor",
    positions: [
      { string: 1, fret: 2 }, // E줄 2프렛
      { string: 2, fret: 3 }, // B줄 3프렛
      { string: 3, fret: 4 }, // G줄 4프렛
      { string: 4, fret: 4 }, // D줄 4프렛
      { string: 5, fret: 2 }, // A줄 2프렛
    ],
    difficulty: "중급",
    notes: ["B", "D", "F#"],
    description: "바레 코드 형태의 마이너 코드입니다.",
    tips: [
      "2프렛에서 바레를 하세요",
      "높은 프렛까지 사용하는 코드입니다"
    ],
    category: "바레"
  },

  // 7th 코드 (7개)
  {
    name: "C7",
    fullName: "C Dominant 7th",
    positions: [
      { string: 2, fret: 1 }, // B줄 1프렛
      { string: 3, fret: 3 }, // G줄 3프렛
      { string: 4, fret: 2 }, // D줄 2프렛
      { string: 5, fret: 3 }, // A줄 3프렛
    ],
    difficulty: "중급",
    notes: ["C", "E", "G", "Bb"],
    description: "긴장감 있는 7th 코드입니다.",
    tips: [
      "C코드에서 변형된 형태입니다",
      "블루스에서 자주 사용됩니다"
    ],
    category: "세븐스"
  },
  {
    name: "D7",
    fullName: "D Dominant 7th",
    positions: [
      { string: 1, fret: 2 }, // E줄 2프렛
      { string: 2, fret: 1 }, // B줄 1프렛
      { string: 3, fret: 2 }, // G줄 2프렛
    ],
    difficulty: "초급",
    notes: ["D", "F#", "A", "C"],
    description: "밝은 느낌의 7th 코드입니다.",
    tips: [
      "D코드에서 2번줄만 1프렛으로 바꾸세요",
      "4, 5, 6번줄은 치지 마세요"
    ],
    category: "세븐스"
  },
  {
    name: "E7",
    fullName: "E Dominant 7th",
    positions: [
      { string: 3, fret: 1 }, // G줄 1프렛
      { string: 5, fret: 2 }, // A줄 2프렛
    ],
    difficulty: "초급",
    notes: ["E", "G#", "B", "D"],
    description: "강력한 7th 코드입니다.",
    tips: [
      "E코드에서 4번줄을 빼면 됩니다",
      "블루스와 록에서 많이 사용됩니다"
    ],
    category: "세븐스"
  },
  {
    name: "F7",
    fullName: "F Dominant 7th",
    positions: [
      { string: 1, fret: 1 }, // E줄 1프렛
      { string: 2, fret: 1 }, // B줄 1프렛
      { string: 3, fret: 2 }, // G줄 2프렛
      { string: 4, fret: 1 }, // D줄 1프렛
      { string: 5, fret: 3 }, // A줄 3프렛
      { string: 6, fret: 1 }, // E줄 1프렛
    ],
    difficulty: "중급",
    notes: ["F", "A", "C", "Eb"],
    description: "바레 코드 형태의 7th 코드입니다.",
    tips: [
      "F코드에서 4번줄을 1프렛으로 바꾸세요",
      "바레 코드의 응용형입니다"
    ],
    category: "세븐스"
  },
  {
    name: "G7",
    fullName: "G Dominant 7th",
    positions: [
      { string: 1, fret: 1 }, // E줄 1프렛
      { string: 5, fret: 2 }, // A줄 2프렛
      { string: 6, fret: 3 }, // E줄 3프렛
    ],
    difficulty: "중급",
    notes: ["G", "B", "D", "F"],
    description: "진행감을 만드는 7th 코드입니다.",
    tips: [
      "G코드에서 1번줄을 1프렛으로 바꾸세요",
      "다음 코드로의 연결이 중요합니다"
    ],
    category: "세븐스"
  },
  {
    name: "A7",
    fullName: "A Dominant 7th",
    positions: [
      { string: 2, fret: 2 }, // B줄 2프렛
      { string: 4, fret: 2 }, // D줄 2프렛
    ],
    difficulty: "초급",
    notes: ["A", "C#", "E", "G"],
    description: "간단한 7th 코드입니다.",
    tips: [
      "A코드에서 3번줄을 빼면 됩니다",
      "손가락 두 개만 사용합니다"
    ],
    category: "세븐스"
  },
  {
    name: "B7",
    fullName: "B Dominant 7th",
    positions: [
      { string: 2, fret: 1 }, // B줄 1프렛
      { string: 3, fret: 3 }, // G줄 3프렛
      { string: 4, fret: 2 }, // D줄 2프렛
      { string: 5, fret: 4 }, // A줄 4프렛
    ],
    difficulty: "중급",
    notes: ["B", "D#", "F#", "A"],
    description: "복잡한 손가락 배치의 7th 코드입니다.",
    tips: [
      "넓은 프렛 범위를 사용합니다",
      "정확한 손가락 위치가 중요합니다"
    ],
    category: "세븐스"
  }
];

export function ChordInfoView({ onBack }: ChordInfoViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [selectedChord, setSelectedChord] = useState<ChordInfo | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const categories = ["전체", "메이저", "마이너", "세븐스", "바레", "기타"];

  // 필터링된 코드 목록
  const filteredChords = chordDatabase.filter(chord => {
    const matchesSearch = chord.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chord.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "전체" || chord.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 기타 지판 렌더링
  const renderChordDiagram = (chord: ChordInfo) => {
    const frets = 5;
    const stringNames = ['E', 'B', 'G', 'D', 'A', 'E']; // 1번줄부터 6번줄까지

    return (
      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
        <h4 className="text-center font-medium text-amber-800 mb-3">{chord.name} 코드</h4>
        
        {/* 프렛 번호 표시 */}
        <div className="flex mb-2">
          <div className="w-10"></div> {/* 줄 이름 공간 */}
          {Array.from({ length: frets + 1 }, (_, fretIndex) => (
            <div key={fretIndex} className="flex-1 text-center text-xs text-amber-700">
              {fretIndex}
            </div>
          ))}
        </div>
        
        {/* 기타 지판 */}
        <div className="relative">
          {stringNames.map((stringName, stringIndex) => {
            const stringNumber = stringIndex + 1;
            const stringThickness = stringNumber === 6 ? 2.5 : stringNumber === 5 ? 2 : 1.5;
            
            return (
              <div key={stringIndex} className="flex items-center mb-3 relative">
                {/* 줄 이름 */}
                <div className="w-10 text-right pr-2 text-xs font-medium text-amber-800">
                  {stringName}
                </div>
                
                {/* 기타 줄 (가로선) */}
                <div 
                  className="absolute bg-amber-600 opacity-40"
                  style={{
                    left: '40px',
                    right: '0',
                    height: `${stringThickness}px`,
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                />
                
                {/* 프렛 위치 표시 */}
                {Array.from({ length: frets + 1 }, (_, fretIndex) => {
                  const hasPosition = chord.positions.some(
                    p => p.string === stringNumber && p.fret === fretIndex
                  );
                  
                  return (
                    <div
                      key={fretIndex}
                      className={`flex-1 h-8 mx-1 flex items-center justify-center relative z-10 ${
                        fretIndex === 0 ? 'bg-amber-100/60' : ''
                      }`}
                    >
                      {hasPosition && (
                        <div className="w-5 h-5 bg-red-500 rounded-full border-2 border-red-600 flex items-center justify-center">
                          <span className="text-white text-xs">●</span>
                        </div>
                      )}
                    </div>
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
                  left: `${40 + (fretIndex * (100 - 10) / frets)}%`,
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

  // 코드 상세 정보 모달
  const renderChordDetail = (chord: ChordInfo) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{chord.name}</h3>
              <p className="text-gray-600">{chord.fullName}</p>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => setSelectedChord(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>

          {/* 코드 다이어그램 */}
          <div className="mb-6">
            {renderChordDiagram(chord)}
          </div>

          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">구성음</h4>
              <div className="flex gap-2">
                {chord.notes.map((note, index) => (
                  <Badge key={index} variant="secondary">{note}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">난이도</h4>
              <Badge variant={
                chord.difficulty === "초급" ? "default" : 
                chord.difficulty === "중급" ? "secondary" : "destructive"
              }>
                {chord.difficulty}
              </Badge>
            </div>
          </div>

          {/* 설명 */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-800 mb-2">설명</h4>
            <p className="text-gray-600 leading-relaxed">{chord.description}</p>
          </div>

          {/* 연주 팁 */}
          <div>
            <h4 className="font-medium text-gray-800 mb-2">연주 팁</h4>
            <ul className="space-y-2">
              {chord.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-teal-500 mt-1">•</span>
                  <span className="text-gray-600">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
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
            <h1 className="text-xl font-bold text-gray-800">코드 정보 보기</h1>
            <p className="text-sm text-gray-600">기타 코드 상세 정보</p>
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
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-medium text-teal-600">
                {filteredChords.length}개 코드
              </span>
            </div>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 검색 */}
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="코드명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* 카테고리 필터 */}
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-xs"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* 코드 목록 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChords.map((chord, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => setSelectedChord(chord)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{chord.name}</CardTitle>
                  <Badge variant={
                    chord.difficulty === "초급" ? "default" : 
                    chord.difficulty === "중급" ? "secondary" : "destructive"
                  } className="text-xs">
                    {chord.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{chord.fullName}</p>
              </CardHeader>
              <CardContent>
                <div className="mb-3">
                  <div className="flex gap-1 mb-2">
                    {chord.notes.map((note, noteIndex) => (
                      <Badge key={noteIndex} variant="outline" className="text-xs">
                        {note}
                      </Badge>
                    ))}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {chord.category}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {chord.description}
                </p>
                <div className="flex items-center gap-1 mt-3 text-teal-600">
                  <Info className="w-4 h-4" />
                  <span className="text-xs">자세히 보기</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 검색 결과 없음 */}
        {filteredChords.length === 0 && (
          <div className="text-center py-12">
            <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-500">
              다른 검색어나 카테고리를 시도해보세요
            </p>
          </div>
        )}

        {/* 코드 상세 정보 모달 */}
        {selectedChord && renderChordDetail(selectedChord)}

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