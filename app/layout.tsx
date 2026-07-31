import "./globals.css";

export const metadata = {
  title: "NotionSnap",
  description: "一鍵將 Notion 筆記轉換為高質感社群圖卡",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
