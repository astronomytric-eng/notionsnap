"use client";

import { useState, useRef } from "react";
import { toPng } from "html-to-image";

export default function Home() {
  const [text, setText] = useState(
    "不要試圖解決所有人的問題。找到一個精準的小痛點，把它做到極致，你的副業就能超越主業。"
  );
  
  const [theme, setTheme] = useState<"notion" | "dark" | "sunset">("notion");
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
          background: "linear-gradient(to top right, #fef3c7, #ffe4e6)",
          color: "#2D2D2D",
          borderColor: "rgba(251, 113, 133, 0.3)",
        };
      default:
        return {
          backgroundColor: "#ffffff",
          color: "#37352F",
          borderColor: "#E9E9E7",
        };
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
        padding: "24px 16px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: "560px", width: "100%" }}>
        {/* 頁頭 */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            💡 NotionSnap
          </h1>
          <p style={{ color: "#787774", fontSize: "16px", margin: 0 }}>
            一鍵將 Notion 筆記轉換為高質感社群圖卡
          </p>
        </div>

        {/* 輸入框 */}
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
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: "600",
              color: "#787774",
              marginBottom: "8px",
              letterSpacing: "0.5px",
            }}
          >
            輸入文字內容
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
              fontSize: "16px",
              backgroundColor: "transparent",
              color: "#37352F",
              boxSizing: "border-box",
            }}
            placeholder="請輸入欲轉換為卡片的文字..."
          />
        </div>

        {/* 控制面板 */}
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #E9E9E7",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            marginBottom: "24px",
          }}
        >
          {/* 主題切換 */}
          <div
            style={{
              display: "flex",
              justifySpace: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <span
              style={{ fontSize: "12px", fontWeight: "600", color: "#787774" }}
            >
              風格主題：
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setTheme("notion")}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: theme === "notion" ? "#37352F" : "#e5e7eb",
                  backgroundColor: theme === "notion" ? "#37352F" : "#f9fafb",
                  color: theme === "notion" ? "#ffffff" : "#4b5563",
                }}
              >
                📄 經典 Notion
              </button>
              <button
                onClick={() => setTheme("dark")}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: theme === "dark" ? "#000000" : "#e5e7eb",
                  backgroundColor: theme === "dark" ? "#000000" : "#f9fafb",
                  color: theme === "dark" ? "#ffffff" : "#4b5563",
                }}
              >
                🌙 暗黑模式
              </button>
              <button
                onClick={() => setTheme("sunset")}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: theme === "sunset" ? "#fb7185" : "#e5e7eb",
                  backgroundColor: theme === "sunset" ? "#fb7185" : "#f9fafb",
                  color: theme === "sunset" ? "#ffffff" : "#4b5563",
                }}
              >
                🌅 暖陽霞光
              </button>
            </div>
          </div>

          {/* 尺寸切換 */}
          <div
            style={{
              display: "flex",
              justifySpace: "space-between",
              alignItems: "center",
              paddingTop: "12px",
              borderTop: "1px solid #f3f4f6",
            }}
          >
            <span
              style={{ fontSize: "12px", fontWeight: "600", color: "#787774" }}
            >
              卡片尺寸：
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setAspectRatio("square")}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: aspectRatio === "square" ? "#37352F" : "#e5e7eb",
                  backgroundColor:
                    aspectRatio === "square" ? "#37352F" : "#f9fafb",
                  color: aspectRatio === "square" ? "#ffffff" : "#4b5563",
                }}
              >
                🔲 1:1 正方形
              </button>
              <button
                onClick={() => setAspectRatio("landscape")}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor:
                    aspectRatio === "landscape" ? "#37352F" : "#e5e7eb",
                  backgroundColor:
                    aspectRatio === "landscape" ? "#37352F" : "#f9fafb",
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
          <p
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#787774",
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            卡片即時預覽
          </p>
          <div
            ref={cardRef}
            style={{
              padding: "32px",
              borderRadius: "16px",
              border: "1px solid",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxSizing: "border-box",
              width: "100%",
              aspectRatio: aspectRatio === "square" ? "1 / 1" : "auto",
              minHeight: aspectRatio === "landscape" ? "220px" : "auto",
              ...getThemeStyle(),
            }}
          >
            <div
              style={{
                fontSize: "18px",
                lineHeight: "1.6",
                whiteSpace: "pre-wrap",
                flex: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              {text || "請在上方輸入文字..."}
            </div>
            <div
              style={{
                marginTop: "24px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  opacity: 0.4,
                  fontFamily: "monospace",
                }}
              >
                Made with NotionSnap
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
            fontSize: "16px",
            fontWeight: "500",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          📥 一鍵下載 PNG 圖卡
        </button>
      </div>
    </main>
  );
}
