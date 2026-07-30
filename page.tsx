"use client";

import { useState, useRef } from "react";
import { toPng } from "html-to-image";

export default function Home() {
  const [text, setText] = useState(
    "不要試圖解決所有人的問題。找到一個精準的小痛點，把它做到極致，你的副業就能超越主業。"
  );
  
  // 樣式主題與尺寸設定
  const [theme, setTheme] = useState<"notion" | "dark" | "sunset">("notion");
  const [aspectRatio, setAspectRatio] = useState<"square" | "landscape">("square");
  const cardRef = useRef<HTMLDivElement>(null);

  // 一鍵下載圖片邏輯
  const handleDownload = async () => {
    if (cardRef.current === null) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true });
      const link = document.createElement("a");
      link.download = `notionsnap-${theme}-${aspectRatio}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("下載失敗：", err);
      alert("下載圖片失敗，請重試！");
    }
  };

  // 主題顏色對照
  const themeStyles = {
    notion: "bg-white text-[#37352F] border-[#E9E9E7]",
    dark: "bg-[#191919] text-[#D4D4D4] border-[#2F2F2F]",
    sunset: "bg-gradient-to-tr from-amber-100 to-rose-100 text-[#2D2D2D] border-rose-200/50",
  };

  return (
    <main className="min-h-screen bg-[#F7F6F3] text-[#37352F] flex flex-col items-center justify-center p-6 py-12">
      {/* 頂部標題區 */}
      <div className="max-w-2xl w-full text-center mb-8">
        <h1 className="text-4xl font-bold mb-3 flex items-center justify-center gap-2">
          💡 NotionSnap
        </h1>
        <p className="text-[#787774] text-lg">
          一鍵將 Notion 筆記轉換為高質感社群圖卡
        </p>
      </div>

      {/* 主要工作區 */}
      <div className="max-w-xl w-full space-y-6">
        {/* 輸入框 */}
        <div className="bg-white p-4 rounded-xl border border-[#E9E9E7] shadow-sm">
          <label className="block text-xs font-semibold text-[#787774] mb-2 uppercase tracking-wider">
            輸入文字內容
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full p-2 border-none focus:outline-none resize-none text-base bg-transparent text-[#37352F]"
            placeholder="請輸入欲轉換為卡片的文字..."
          />
        </div>

        {/* 風格與尺寸控制區 */}
        <div className="bg-white p-4 rounded-xl border border-[#E9E9E7] shadow-sm space-y-4">
          {/* 主題切換 */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#787774] uppercase tracking-wider">
              風格主題：
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme("notion")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  theme === "notion"
                    ? "border-[#37352F] bg-[#37352F] text-white"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                📄 經典 Notion
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  theme === "dark"
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                🌙 暗黑模式
              </button>
              <button
                onClick={() => setTheme("sunset")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  theme === "sunset"
                    ? "border-rose-400 bg-rose-400 text-white"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                🌅 暖陽霞光
              </button>
            </div>
          </div>

          {/* 尺寸切換 */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-xs font-semibold text-[#787774] uppercase tracking-wider">
              卡片尺寸：
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setAspectRatio("square")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  aspectRatio === "square"
                    ? "border-[#37352F] bg-[#37352F] text-white"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                🔲 1:1 正方形 (IG/Threads)
              </button>
              <button
                onClick={() => setAspectRatio("landscape")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  aspectRatio === "landscape"
                    ? "border-[#37352F] bg-[#37352F] text-white"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                🖼️ 橫版卡片
              </button>
            </div>
          </div>
        </div>

        {/* 卡片預覽區 */}
        <div className="mt-6 flex flex-col items-center">
          <p className="text-xs font-semibold text-[#787774] mb-3 uppercase tracking-wider text-center">
            卡片即時預覽
          </p>
          <div
            ref={cardRef}
            className={`p-8 rounded-2xl border shadow-md relative flex flex-col justify-between transition-all w-full ${               aspectRatio === "square" ? "aspect-square" : "min-h-[220px]"             } ${themeStyles[theme]}`}
          >
            <div className="text-lg leading-relaxed font-normal whitespace-pre-wrap flex-1 flex items-center">
              {text || "請在上方輸入文字..."}
            </div>
            <div className="mt-6 flex justify-end items-center">
              <span className="text-xs opacity-40 font-mono tracking-wide">
                Made with NotionSnap
              </span>
            </div>
          </div>
        </div>

        {/* 下載按鈕 */}
        <button
          onClick={handleDownload}
          className="w-full bg-[#37352F] text-white py-3.5 rounded-xl font-medium shadow-md hover:bg-[#23221E] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 text-base"
        >
          📥 一鍵下載 PNG 圖卡
        </button>
      </div>
    </main>
  );
}