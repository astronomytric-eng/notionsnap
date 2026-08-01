"use client";

import { useState, useRef, useEffect } from "react";
import { toPng, toBlob } from "html-to-image";

// 基礎簡繁字典映射 (針對 API 常見字詞進行轉換)
const t2sMap: Record<string, string> = {
  "国": "國", "国": "國", "爱": "愛", "风": "風", "龙": "龍", "书": "書", "门": "門", "长": "長",
  "见": "見", "发": "發", "头": "頭", "关": "關", "东": "東", "车": "車", "马": "馬", "鸟": "鳥",
  "时": "時", "间": "間", "过": "過", "对": "對", "开": "開", "问": "問", "动": "動", "产": "產",
  "业": "業", "经": "經", "给": "給", "认": "認", "为": "為", "样": "樣", "种": "種", "调": "調",
  "变": "變", "单": "單", "现": "現", "实": "實", "难": "難", "乐": "樂", "欢": "歡", "让": "讓",
  "话": "話", "导": "導", "写": "寫", "听": "聽", "视": "視", "频": "頻", "网": "網", "红": "紅",
  "绿": "綠", "蓝": "藍", "线": "線", "级": "級", "组": "組", "织": "織", "终": "終", "细": "細",
  "节": "節", "万": "萬", "与": "與", "丑": "醜", "专": "專", "丝": "絲", "两": "兩", "严": "嚴",
  "丧": "喪", "个": "個", "临": "臨", "为": "為", "丽": "麗", "举": "舉", "么": "麼", "义": "義",
  "乌": "烏", "乐": "樂", "乔": "喬", "习": "習", "书": "書", "买": "買", "乱": "亂", "争": "爭",
  "于": "於", "亏": "虧", "亚": "亞", "产": "產", "亲": "親", "亿": "億", "什": "什", "从": "從",
  "仑": "侖", "仓": "倉", "仪": "儀", "们": "們", "价": "價", "众": "眾", "优": "優", "伙": "夥",
  "会": "會", "伟": "偉", "传": "傳", "伤": "傷", "伦": "倫", "伪": "偽", "体": "體", "余": "餘",
  "佣": "傭", "佩": "佩", "佬": "佬", "佰": "佰", "佳": "佳", "併": "併", "来": "來", "保": "保",
  "侠": "俠", "信": "信", "修": "修", "俱": "俱", "倍": "倍", "倒": "倒", "借": "借", "倦": "倦",
  "倾": "傾", "假": "假", "偏": "偏", "停": "停", "健": "健", "偶": "偶", "偿": "償", "傀": "傀",
  "傅": "傅", "傍": "傍", "杰": "傑", "备": "備", "催": "催", "傲": "傲", "传": "傳", "债": "債",
  "倾": "傾", "伤": "傷", "傻": "傻", "像": "像", "僚": "僚", "伪": "偽", "僧": "僧", "侥": "僥",
  "僧": "僧", "僭": "僭", "僮": "僮", "仆": "僕", "嘻": "嘻", "僚": "僚", "伪": "偽", "僾": "僾",
  "仪": "儀", "亿": "億", "木": "木", "本": "本", "术": "術", "朴": "樸", "机": "機", "杀": "殺",
  "杂": "雜", "权": "權", "极": "極", "构": "構", "林": "林", "果": "果", "枝": "枝", "枢": "樞",
  "枣": "棗", "枪": "槍", "枫": "楓", "枭": "梟", "柜": "櫃", "柠": "檸", "查": "查", "柬": "柬",
  "柯": "柯", "柱": "柱", "柳": "柳", "柴": "柴", "栅": "柵", "标": "標", "栈": "棧", "栋": "棟",
  "栏": "欄", "树": "樹", "栖": "棲", "栗": "栗", "校": "校", "株": "株", "样": "樣", "核": "核",
  "根": "根", "格": "格", "栽": "栽", "桂": "桂", "桃": "桃", "框": "框", "案": "案", "桌": "桌",
  "桐": "桐", "桑": "桑", "桓": "桓", "桔": "桔", "桥": "橋", "桧": "檜", "浆": "漿", "桨": "槳",
  "桩": "樁", "桶": "桶", "梁": "梁", "梅": "梅", "梦": "夢", "梧": "梧", "梨": "梨", "梭": "梭",
  "梯": "梯", "械": "械", "梳": "梳", "梵": "梵", "检": "檢", "棉": "棉", "棋": "棋", "棍": "棍",
  "棒": "棒", "棕": "棕", "棚": "棚", "棠": "棠", "森": "森", "棱": "稜", "棵": "棵", "椭": "橢",
  "楼": "樓", "榄": "欖", "榆": "榆", "脚": "腳", "脸": "臉", "脑": "腦", "脱": "脫", "腊": "臘",
  "腐": "腐", "腑": "腑", "腓": "腓", "腔": "腔", "腕": "腕", "腥": "腥", "脑": "腦", "肿": "腫",
  "腮": "腮", "腰": "腰", "腱": "腱", "肠": "腸", "腹": "腹", "腺": "腺", "腿": "腿", "膀": "膀",
  "膂": "膂", "膈": "膈", "膊": "膊", "膏": "膏", "膑": "臏", "肤": "膚", "膛": "膛", "膜": "膜",
  "膝": "膝", "胶": "膠", "膨": "膨", "腻": "膩", "膳": "膳", "膺": "膺", "胆": "膽", "脍": "膾",
  "脓": "膿", "臀": "臀", "臂": "臂", "臆": "臆", "脸": "臉", "脐": "臍", "臏": "臏", "臲": "臲",
  "举": "舉", "旧": "舊", "舱": "艙", "舰": "艦", "艰": "艱", "艳": "艷", "艺": "藝", "节": "節",
  "范": "範", "芒": "芒", "芦": "蘆", "苏": "蘇", "苹": "蘋", "范": "範", "茎": "莖", "茧": "繭",
  "茫": "茫", "茬": "茬", "茱": "茱", "茵": "茵", "茶": "茶", "茸": "茸", "茹": "茹", "荀": "荀",
  "荃": "荃", "草": "草", "荆": "荊", "荐": "薦", "荒": "荒", "荔": "荔", "荚": "莢", "荡": "蕩",
  "荣": "榮", "荤": "葷", "荧": "熒", "荫": "蔭", "药": "藥", "荷": "荷", "莳": "蒔", "莅": "蒞",
  "莉": "莉", "庄": "莊", "莎": "莎", "莒": "莒", "莓": "莓", "莘": "莘", "莞": "莞", "莨": "莨",
  "莺": "鶯", "莽": "莽", "莫": "莫", "莱": "萊", "莲": "蓮", "莳": "蒔", "莴": "萵", "获": "獲",
  "莹": "瑩", "莺": "鶯", "莼": "蓴", "莽": "莽", "菊": "菊", "菌": "菌", "菜": "菜", "菠": "菠",
  "菩": "菩", "华": "華", "菱": "菱", "菲": "菲", "萨": "薩", "萤": "螢", "乾": "乾", "説": "說",
  "爱": "愛", "点": "點", "线": "線", "话": "話", "说": "說", "这": "這", "还": "還", "进": "進"
};

// 簡易轉換函式
const convertToTC = (str: string) => {
  return str.split("").map((char) => t2sMap[char] || char).join("");
};

export default function Home() {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [theme, setTheme] = useState<"notion" | "dark" | "sunset" | "morandi" | "midnight">("notion");
  const [fontStyle, setFontStyle] = useState<"sans" | "serif" | "mono">("sans");
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");
  const [aspectRatio, setAspectRatio] = useState<"square" | "landscape">("square");
  const [copied, setCopied] = useState(false);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 專門抓取「電影/動漫/名人名言」並自動轉換為繁體中文
  const fetchRandomQuote = async () => {
    setIsLoadingQuote(true);
    try {
      const res = await fetch("https://v1.hitokoto.cn/?c=a&c=b&c=h&c=k&c=i");
      const data = await res.json();
      if (data && data.hitokoto) {
        // 全自動簡轉繁
        const quoteText = convertToTC(data.hitokoto);
        const rawFromWho = data.from_who ? convertToTC(data.from_who) : "";
        const rawFrom = data.from ? convertToTC(data.from) : "";
        
        const quoteFrom = rawFromWho 
          ? `@${rawFromWho}《${rawFrom}》` 
          : rawFrom 
          ? `@《${rawFrom}》` 
          : "@NotionSnap";
          
        handleTextChange(quoteText);
        handleAuthorChange(quoteFrom);
      }
    } catch (err) {
      console.error("抓取靈感失敗：", err);
      handleTextChange("生活就像一盒巧克力，你永遠不知道下一顆是什麼味道。");
      handleAuthorChange("@《阿甘正傳》");
    } finally {
      setIsLoadingQuote(false);
    }
  };

  // 初始化讀取 LocalStorage 自動記憶內容
  useEffect(() => {
    const savedText = localStorage.getItem("notionsnap_text");
    const savedAuthor = localStorage.getItem("notionsnap_author");

    if (savedText) {
      setText(savedText);
      setAuthor(savedAuthor || "@NotionSnap");
    } else {
      fetchRandomQuote();
    }
  }, []);

  const handleTextChange = (val: string) => {
    setText(val);
    localStorage.setItem("notionsnap_text", val);
  };

  const handleAuthorChange = (val: string) => {
    setAuthor(val);
    localStorage.setItem("notionsnap_author", val);
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
              onClick={fetchRandomQuote}
              disabled={isLoadingQuote}
              style={{
                backgroundColor: "#f3f4f6",
                border: "none",
                borderRadius: "4px",
                padding: "3px 8px",
                fontSize: "11px",
                fontWeight: "500",
                color: "#4b5563",
                cursor: isLoadingQuote ? "wait" : "pointer",
                opacity: isLoadingQuote ? 0.6 : 1,
              }}
            >
              {isLoadingQuote ? "🎲 載入金句中..." : "🎬 名人/電影繁體金句"}
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
