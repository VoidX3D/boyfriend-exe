export interface AnswerOption { id: string; text: string; correct?: boolean; reaction?: { title: string; body: string }; feedback?: string; }
export interface Question { id: number; phase?: string; category: string; question: string; text?: string; hint?: string; options: AnswerOption[]; correctFeedback?: string; isFinal?: boolean; sfx?: string; }
export interface PhantomQuestion { id: string | number; phase?: string; category: string; injectAfter: number; question: string; text?: string; warning?: string; options: AnswerOption[]; reveal: string; }
export interface BonusQuestion { id: number; category: string; question: string; options: AnswerOption[]; }
export interface QuestionsData { questions: Question[]; phantomQuestions: PhantomQuestion[]; bonusQuestions: BonusQuestion[]; }
export interface MascotMessages { idle: string[]; correct: string[]; wrong: string[]; hint: string[]; end: string[]; }
export interface ContentData { wrongScreens: { title: string; body: string; type?: string }[]; correctScreens: { title: string; body: string; type?: string }[]; wrongReactions: Record<string, { title: string; body: string }[]>; correctReactions: Record<string, { title: string; body: string }[]>; timing: { fast: { title: string; body: string }[]; slow: { title: string; body: string }[] }; wrongStreak: { title: string; body: string }[]; escalation: string[]; systemMessages: string[]; achievements: { id: string; name: string; desc?: string }[]; mascotMessages?: MascotMessages; boyfriendResponses?: Record<string, string>; [k: string]: unknown; }
export interface PlaylistTrack { id: string; title: string; artist: string; file: string; format: string; description?: string; enabled?: boolean; }
export interface Playlist { defaultTrack: string; tracks: PlaylistTrack[]; }
export type FlowItem = { type: "real"; q: Question } | { type: "phantom"; q: PhantomQuestion };
export interface RedirectPage { type?: string; title?: string; body?: string; url?: string; btn?: string; tone?: "good"|"bad"; subtext?: string; }
