import type { ContentData, Playlist, QuestionsData } from "./types";
export function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random()*arr.length)]; }
export function clamp(n:number, lo:number, hi:number){ return Math.max(lo, Math.min(hi,n)); }
export async function loadGameData(): Promise<{ questions: QuestionsData; content: ContentData; playlist: Playlist }> {
  const [q,c,p] = await Promise.all([
    fetch("/data/questions.json").then(r=>r.json()),
    fetch("/data/content.json").then(r=>r.json()),
    fetch("/data/playlist.json").then(r=>r.json()),
  ]);
  return { questions: q, content: c, playlist: p };
}
