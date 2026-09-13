import type { Metadata } from "next";import "./globals.css";import "./portfolio.css";
export const metadata: Metadata={title:"Digital PA Portfolio 2569 | นายคมศร อุดมเพ็ญ",description:"Digital PA Portfolio 2569 — Technology • Innovation • Learning"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="th"><body>{children}</body></html>}