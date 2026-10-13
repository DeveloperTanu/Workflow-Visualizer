"use client";
import { useParams } from "next/navigation";
import { EditorLoader } from "@/components/workflow-editor/EditorLoader";
export default function Page() { const { id } = useParams<{ id: string }>(); return <div className="h-full"><EditorLoader id={id} /></div>; }
