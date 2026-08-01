"use client";

import { useState, useRef, useEffect } from "react";
import { toPng, toBlob } from "html-to-image";

const QUOTES = [
  "不要試圖解決所有人的問題。找到一個精準的小痛點，把它做到極致，你的副業就能超越主業。",
  "種一棵樹最好的時間是十年前，其次就是現在。",
  "簡潔是智慧的靈魂，也是優秀產品的唯一標準。",
  "專注於提供價值，商業模式自然會在過程中浮現。",
  "建立個人品牌的本質，就是持續輸出有價值的內容並保持真誠。",
  "執行力就是最好的天賦，想到了就立刻去驗證。"
];

export default function Home() {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [theme, setTheme] = useState<"notion" | "dark" | "sunset" | "morandi" | "midnight">("notion");
  const [fontStyle, setFontStyle] = useState<"sans" | "serif" | "mono">("sans");
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");
  const [aspectRatio, setAspectRatio] = useState<"square" | "landscape">("square");
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 初始化讀取 LocalStorage 自動記憶內容
  useEffect(() => {
    const savedText = localStorage.getItem("notionsnap_text");
    const savedAuthor = localStorage.getItem("notionsnap_author");
    
    setText(savedText !== null ? savedText : QUOTES[0]);
    setAuthor(savedAuthor !== null ? savedAuthor : "@notionsnap");
  }, []);

  // 當文字或署名改變時，自動寫入記憶
  const handleTextChange = (val: string) => {
    setText(val);
    localStorage.setItem("notionsnap_text", val);
  };

  const handleAuthorChange = (val: string) => {
    setAuthor(val);
    localStorage.setItem("notionsnap_author", val);
  };

  // 隨機靈感按鈕
  const handleRandomQuote = () => {
    const random = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    handleTextChange(random);
  };

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

  const handleCopyImage = async () => {
    if (cardRef.current === null) return;
    try {
      const blob = await toBlob(cardRef.current, { cacheBust: true });
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("複製失敗：", err);
      alert("瀏覽器不支援直接複製圖片，請改用「下載 PNG」！");
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

  const getFontSizePx = () => {
    switch (fontSize) {
      case "small":
        return "16px";
      case "large":
        return "22px";
      default:
        return "19px";
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#787774" }}>
              文字內容
            </label>
            <button
              onClick={handleRandomQuote}
              style={{
                backgroundColor: "#f3f4f6",
                border: "none",
                borderRadius: "4px",
                padding: "3px 8px",
                fontSize: "11px",
                fontWeight: "500",
                color: "#4b5563",
                cursor: "pointer",
              }}
            >
              ✨ 隨機靈感
            </button>
          </div>

          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
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
              onChange={(e) => handleAuthorChange(e.target.value)}
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

          {/* 字體與對齊 */}
          <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "12px", marginBottom: "12px", display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
            <div>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#787774", display: "block", marginBottom: "8px" }}>
                字體風格：
              </span>
              <div style={{ display: "flex", gap: "6px" }}>
                {[
                  { id: "sans", name: "無襯線" },
                  { id: "serif", name: "明體" },
                  { id: "mono", name: "等寬" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFontStyle(item.id as any)}
                    style={{
                      padding: "5px 8px",
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

            <div>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#787774", display: "block", marginBottom: "8px" }}>
                對齊方式：
              </span>
              <div style={{ display: "flex", gap: "6px" }}>
                {[
                  { id: "left", name: "⬅️ 靠左" },
                  { id: "center", name: "↔️ 居中" },
                  { id: "right", name: "➡️ 靠右" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTextAlign(item.id as any)}
                    style={{
                      padding: "5px 8px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      cursor: "pointer",
                      border: "1px solid",
                      borderColor: textAlign === item.id ? "#37352F" : "#e5e7eb",
                      backgroundColor: textAlign === item.id ? "#37352F" : "#f9fafb",
                      color: textAlign === item.id ? "#ffffff" : "#4b5563",
                    }}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 尺寸與字級 */}
          <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "12px", display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
            <div>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#787774", display: "block", marginBottom: "8px" }}>
                卡片尺寸：
              </span>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={() => setAspectRatio("square")}
                  style={{
                    padding: "5px 8px",
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
                    padding: "5px 8px",
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

            <div>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#787774", display: "block", marginBottom: "8px" }}>
                字體大小：
              </span>
              <div style={{ display: "flex", gap: "6px" }}>
                {[
                  { id: "small", name: "S" },
                  { id: "medium", name: "M" },
                  { id: "large", name: "L" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFontSize(item.id as any)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      border: "1px solid",
                      borderColor: fontSize === item.id ? "#37352F" : "#e5e7eb",
                      backgroundColor: fontSize === item.id ? "#37352F" : "#f9fafb",
                      color: fontSize === item.id ? "#ffffff" : "#4b5563",
                    }}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
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
            <div
              style={{
                fontSize: getFontSizePx(),
                lineHeight: "1.7",
                whiteSpace: "pre-wrap",
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: textAlign === "center" ? "center" : textAlign === "right" ? "flex-end" : "flex-start",
                textAlign: textAlign,
              }}
            >
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

        {/* 按鈕組 */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleCopyImage}
            style={{
              flex: 1,
              backgroundColor: "#ffffff",
              color: "#37352F",
              border: "1px solid #E9E9E7",
              padding: "14px",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            {copied ? "✅ 已複製到剪貼簿！" : "📋 複製圖片"}
          </button>
          
          <button
            onClick={handleDownload}
            style={{
              flex: 1,
              backgroundColor: "#37352F",
              color: "#ffffff",
              padding: "14px",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            📥 下載 PNG
          </button>
        </div>
      </div>
    </main>
  );
}
