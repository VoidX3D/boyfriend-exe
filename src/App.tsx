import { useCallback, useEffect, useRef, useState } from "react";
import { useGame, type Phase } from "./game/engine";
import { loadGameData } from "./data";
import { createMusicManager, sfx, type MusicManager } from "./audio";
import type { ContentData } from "./types";
import NameGate from "./components/NameGate";
import Hud from "./components/Hud";
import QuestionScreen from "./components/QuestionScreen";
import RedirectChain from "./components/RedirectChain";
import PhantomScreen from "./components/PhantomScreen";
import ResultScreen from "./components/ResultScreen";
import SecretScreen from "./components/SecretScreen";
import Mascot from "./components/Mascot";
interface GameData{ questions: import("./types").QuestionsData; content: ContentData; playlist: import("./types").Playlist; }
export default function App(){
 const [data,setData]=useState<GameData|null>(null);
 const [ready,setReady]=useState(false);
 const [musicMuted,setMusicMuted]=useState(false);
 const [sfxMuted,setSfxMuted]=useState(()=>localStorage.getItem("sfxMuted")==="true");
 const musicRef=useRef<MusicManager|null>(null);
 useEffect(()=>{ loadGameData().then(d=>{ setData(d as GameData); setReady(true);});},[]);
 useEffect(()=>{ if(ready&&data&&!musicRef.current){ musicRef.current=createMusicManager(data.playlist); setMusicMuted(musicRef.current.muted); }},[ready,data]);
 const playSfx=useCallback((k:string)=>{ if(sfxMuted)return; sfx(k);},[sfxMuted]);
 const toggleSfxMute=useCallback(()=>{ setSfxMuted(p=>{const n=!p; localStorage.setItem("sfxMuted",String(n)); return n;});},[]);
 const toggleMusicMute=useCallback(()=>{ if(!musicRef.current)return; musicRef.current.toggle(); setMusicMuted(musicRef.current.muted);},[]);
 if(!ready||!data) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100dvh",color:"#b9b2d6"}}>LOADING...</div>;
 return <GameShell data={data} musicRef={musicRef} musicMuted={musicMuted} sfxMuted={sfxMuted} onToggleMusic={toggleMusicMute} onToggleSfx={toggleSfxMute} onSfx={playSfx} />;
}
function GameShell({data,musicRef,musicMuted,sfxMuted,onToggleMusic,onToggleSfx,onSfx}:{data:GameData; musicRef:React.MutableRefObject<MusicManager|null>; musicMuted:boolean; sfxMuted:boolean; onToggleMusic:()=>void; onToggleSfx:()=>void; onSfx:(k:string)=>void;}){
 const engine=useGame(data.questions,data.content,onSfx);
 const {view,start,chooseAnswer,retry,giveUp,useHint,phantomSelect,phantomNext,nextRedirect,reset,markCheat}=engine;
 const mascotClickCount=useRef(0); const mascotClickTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const handleMascotClick=useCallback(()=>{ mascotClickCount.current++; if(mascotClickCount.current>=5){ mascotClickCount.current=0; markCheat(); onSfx("glitch"); return;} if(mascotClickTimer.current) clearTimeout(mascotClickTimer.current); mascotClickTimer.current=setTimeout(()=>{mascotClickCount.current=0;},1500);},[markCheat,onSfx]);
 const corruptionLevel=Math.min(5,Math.floor(view.hud.corruption/20));
 const renderPhase=(phase:Phase)=>{ switch(phase){ case "name": return <NameGate onStart={start} />; case "secret": return <SecretScreen data={data.content} onReset={reset} />; case "result": return view.result? <ResultScreen result={view.result} content={data.content} onReset={reset} cheatUsed={view.cheatUsed}/>:<div/>; case "redirect": return <RedirectChain pages={view.redirectPages} current={view.redirectIndex} onAdvance={nextRedirect} />; case "phantom": return view.current?.type==="phantom"? <PhantomScreen item={view.current} picked={view.phantomPicked} timeLeft={view.phantomTimeLeft} onSelect={phantomSelect} onNext={phantomNext}/>:<div/>; default: return <QuestionScreen view={view} data={data.content} onChoose={chooseAnswer} onRetry={retry} onGiveUp={giveUp} onHint={useHint} />; }};
 return <div data-corruption={corruptionLevel===0?1:corruptionLevel} style={{minHeight:"100dvh"}}>
  <div id="app" style={{minHeight:"100dvh",display:"flex",flexDirection:"column"}}>
   {view.phase!=="name" && <><Hud hud={view.hud} musicMuted={musicMuted} sfxMuted={sfxMuted} onToggleMusic={onToggleMusic} onToggleSfx={onToggleSfx} musicRef={musicRef} /></>}
   <div id="stage" style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"14px"}}>{renderPhase(view.phase)}</div>
   <Mascot phase={view.phase} hud={view.hud} onCheat={handleMascotClick} cheatUsed={view.cheatUsed} />
  </div>
  <div id="fx" />
 </div>;
}
