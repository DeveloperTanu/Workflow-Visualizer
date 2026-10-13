import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Shell } from "@/components/layout/Shell";
export const metadata: Metadata = { title: "Workflow Visualizer", description: "Build and run node-based workflows in your browser." };
export default function RootLayout({ children }: { children: ReactNode }) {
  return (<html lang="en" suppressHydrationWarning><body><Shell>{children}</Shell></body></html>);
}
