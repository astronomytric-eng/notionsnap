"use client";

import { useState, useRef, useEffect } from "react";
import { toPng } from "html-to-image";

export default function Home() {
  const [text, setText] = useState(
    "不要試圖解決所有人的問題。找到一個精準的小痛點，把它做到極致，你的副業就能超越主業。"
  );
  const [author, setAuthor] = useState("@notionsnap");
  const [theme, setTheme] = useState<"notion" | "dark" | "sunset" | "morandi" | "midnight">("notion");
  const [fontStyle, setFontStyle] = useState<"sans" | "serif" | "mono">("sans");
  const [aspectRatio, setAspectRatio] = useState<"square" | "landscape">("square");
  const cardRef = useRef<HTMLDivElement>(null);

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

  const getThemeStyle = () => {
    switch (theme) {
      case "dark":
        return {
          backgroundColor: "#191919",
          color: "#D4D4D4",
          borderColor: "#2F2F2F",
        };
      case "sunset":
        return {
          background: "linear-gradient(135deg, #fef3c7 0%, #ffe4e6 50%, #f3e8ff 100%)",
          color: "#2D2D2D",
          borderColor: "rgba(251, 113, 133, 0.3)",
        };
      case "morandi":
        return {
          background: "linear-gradient(135deg, #e2e8f0 0%, #dbeade 100%)",
          color: "#334155",
          borderColor: "#cbd5e1",
        };
      case "midnight":
        return {
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
          color: "#f1f5f9",
          borderColor: "#334155",
        };
      default:
        return {
          backgroundColor: "#ffffff",
          color: "#37352F",
          borderColor: "#E9E9E7",
        };
    }
  };

  const getFontFamily = () => {
    switch (fontStyle) {
      case "serif":
        return '"Noto Serif TC", "Songti TC", Georgia, serif';
      case "mono":
        return '"Fira Code", Monaco, Consolas, monospace';
      default:
        return '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#F7F6F3",
        color: "#37352F",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: "560px", width: "100%" }}>
        {/* 頁頭 */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "8px" }}>
            💡 NotionSnap
          </h1>
          <p style={{ color: "#787774", fontSize: "15px", margin: 0 }}>
            一鍵將 Notion 筆記轉換為高質感社群圖卡
          </p>
        </div>

        {/* 輸入與署名設定 */}
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #E9E9E7",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            marginBottom: "16px",
          }}
        >
          <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#787774", marginBottom: "8px" }}>
            文字內容
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: "15px",
              backgroundColor: "transparent",
              color: "#37352F",
              boxSizing: "border-box",
              marginBottom: "12px",
            }}
            placeholder="請輸入欲轉換為卡片的文字..."
          />
          
          <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#787774" }}>卡片署名：</span>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="例如 @your_name"
              style={{
                flex: 1,
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                padding: "6px 10px",
                fontSize: "13px",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* 控制面板 */}
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #E9E9E7",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            marginBottom: "20px",
          }}
        >
          {/* 主題切換 */}
          <div style={{ marginBottom: "12px" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#787774", display: "block", marginBottom: "8px" }}>
              風格主題：
            </span>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {[
                { id: "notion", name: "📄 經典 Notion" },
                { id: "dark", name: "🌙 暗黑模式" },
                { id: "sunset", name: "🌅 暖陽霞光" },
                { id: "morandi", name: "🎨 莫蘭迪綠" },
                { id: "midnight", name: "🌌 深邃星空" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTheme(item.id as any)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor: theme === item.id ? "#37352F" : "#e5e7eb",
                    backgroundColor: theme === item.id ? "#37352F" : "#f9fafb",
                    color: theme === item.id ? "#ffffff" : "#4b5563",
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* 字體切換 */}
          <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#787774", display: "block", marginBottom: "8px" }}>
              字體風格：
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { id: "sans", name: "無襯線 (預設)" },
                { id: "serif", name: "明體 (質感)" },
                { id: "mono", name: "等寬 (極客)" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFontStyle(item.id as any)}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor: fontStyle === item.id ? "#37352F" : "#e5e7eb",
                    backgroundColor: fontStyle === item.id ? "#37352F" : "#f9fafb",
                    color: fontStyle === item.id ? "#ffffff" : "#4b5563",
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* 尺寸切換 */}
          <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "12px" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#787774", display: "block", marginBottom: "8px" }}>
              卡片尺寸：
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setAspectRatio("square")}
                style={{
                  padding: "5px 10px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: aspectRatio === "square" ? "#37352F" : "#e5e7eb",
                  backgroundColor: aspectRatio === "square" ? "#37352F" : "#f9fafb",
                  color: aspectRatio === "square" ? "#ffffff" : "#4b5563",
                }}
              >
                🔲 1:1 正方形
              </button>
              <button
                onClick={() => setAspectRatio("landscape")}
                style={{
                  padding: "5px 10px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: aspectRatio === "landscape" ? "#37352F" : "#e5e7eb",
                  backgroundColor: aspectRatio === "landscape" ? "#37352F" : "#f9fafb",
                  color: aspectRatio === "landscape" ? "#ffffff" : "#4b5563",
                }}
              >
                🖼️ 橫版卡片
              </button>
            </div>
          </div>
        </div>

        {/* 卡片預覽 */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "12px", fontWeight: "600", color: "#787774", marginBottom: "8px", textAlign: "center" }}>
            卡片即時預覽
          </p>
          <div
            ref={cardRef}
            style={{
              padding: "36px 32px",
              borderRadius: "16px",
              border: "1px solid",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxSizing: "border-box",
              width: "100%",
              aspectRatio: aspectRatio === "square" ? "1 / 1" : "auto",
              minHeight: aspectRatio === "landscape" ? "240px" : "auto",
              fontFamily: getFontFamily(),
              ...getThemeStyle(),
            }}
          >
            <div style={{ fontSize: "19px", lineHeight: "1.7", whiteSpace: "pre-wrap", flex: 1, display: "flex", alignItems: "center" }}>
              {text || "請在上方輸入文字..."}
            </div>
            <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", opacity: 0.6, fontWeight: "500" }}>
                {author || "Made with NotionSnap"}
              </span>
              <span style={{ fontSize: "11px", opacity: 0.3, fontFamily: "monospace" }}>
                NotionSnap
              </span>
            </div>
          </div>
        </div>

        {/* 下載按鈕 */}
        <button
          onClick={handleDownload}
          style={{
            width: "100%",
            backgroundColor: "#37352F",
            color: "#ffffff",
            padding: "14px",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: "500",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          📥 一鍵下載 PNG 圖卡
        </button>
      </div>
    </main>
  );
}
