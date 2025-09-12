import { useState } from "react";
import { GameModeCard } from "./components/GameModeCard";
import { FretboardMatchGame } from "./components/FretboardMatchGame";
import { ChordInputGame } from "./components/ChordInputGame";
import { ChordInfoView } from "./components/ChordInfoView";
import { Guitar, FileText, BookOpen } from "lucide-react";

type GameMode = "main" | "fretboard-match" | "chord-input" | "chord-info";

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>("main");

  const handleGameMode = (mode: string) => {
    console.log(`${mode} 모드 선택됨`);
    switch (mode) {
      case "지판 짝짓기":
        setCurrentMode("fretboard-match");
        break;
      case "코드 입력":
        setCurrentMode("chord-input");
        break;
      case "코드 정보":
        setCurrentMode("chord-info");
        break;
      default:
        setCurrentMode("main");
    }
  };

  if (currentMode === "fretboard-match") {
    return <FretboardMatchGame onBack={() => setCurrentMode("main")} />;
  }

  if (currentMode === "chord-input") {
    return <ChordInputGame onBack={() => setCurrentMode("main")} />;
  }

  if (currentMode === "chord-info") {
    return <ChordInfoView onBack={() => setCurrentMode("main")} />;
  }



  // 메인 화면 렌더링
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-purple-600 rounded-full">
              <Guitar className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">기타 코드 마스터</h1>
          <p className="text-gray-600">게임으로 배우는 기타 코드</p>
        </div>

        {/* 게임 모드 카드들 */}

        <div className="space-y-6">
          <GameModeCard
            title="짝짓기 게임"
            description="기타 지판에서 코드 위치를 맞춰보세요"
            icon={Guitar}
            color="bg-blue-500"
            onClick={() => handleGameMode("지판 짝짓기")}
          />
          
          <GameModeCard
            title="코드 입력 게임"
            description="직접 기타 지판에 코드를 입력하며 연습하세요"
            icon={FileText}
            color="bg-orange-500"
            onClick={() => handleGameMode("코드 입력")}
          />
          
          <GameModeCard
            title="코드 정보 보기"
            description="21개 기본 코드의 상세 정보와 연주 팁을 확인하세요"
            icon={BookOpen}
            color="bg-teal-500"
            onClick={() => handleGameMode("코드 정보")}
          />
        </div>

        {/* 하단 여백 */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}