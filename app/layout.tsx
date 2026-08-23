import type { Metadata } from "next";
import "./globals.css";
import "./interactive-cursor.css";
import "./discovery-answer.css";

export const metadata: Metadata = {
  title: "TechClass — เรียนคอมพิวเตอร์ให้สนุก",
  description: "พื้นที่เรียนรู้วิชาคอมพิวเตอร์และเทคโนโลยีสำหรับคนรุ่นใหม่",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="th"><body>{children}</body></html>;
}
