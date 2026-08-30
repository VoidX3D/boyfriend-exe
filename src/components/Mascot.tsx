import { useEffect, useRef, useState } from "react";
import type { Hud } from "../game/engine";
export default function Mascot({phase,hud,onCheat,cheatUsed}:{phase:string; hud:Hud; onCheat:()=>void; cheatUsed:boolean;}){
 const [speech,setSpeech]=useState<string|null>(null); const timer=useRef<ReturnType<typeof setTimeout>|null>(null); const idleRef=useRef<ReturnType<typeof setInterval>|null>(null);
 const idleLines=["The boyfriend is watching.","Choose wisely.","I'm judging your answers.","This is a boyfriend quiz, not a Choose Your Own Adventure.","The boyfriend believes in you. Mostly."];
 const pick=()=>{ if(cheatUsed){setSpeech("You actually tried to cheat. I'm... impressed?"); return;} if(hud.rage>=80){setSpeech("The boyfriend is experiencing technical difficulties."); return;} if(hud.streak>=5){setSpeech(`🔥 ${hud.streak} streak! The boyfriend is blushing.`); return;} setSpeech(idleLines[Math.floor(Math.random()*idleLines.length)]); };
 useEffect(()=>{ if(phase==="name"||phase==="result"||phase==="secret"){ setSpeech(null); return;} const init=setTimeout(pick,3000); idleRef.current=setInterval(pick,12000); return()=>{clearTimeout(init); clearInterval(idleRef.current!);};},[phase,cheatUsed,hud.rage,hud.streak]);
 useEffect(()=>{ if(speech){ if(timer.current)clearTimeout(timer.current); timer.current=setTimeout(()=>setSpeech(null),5000);} return()=>{if(timer.current)clearTimeout(timer.current);};},[speech]);
 if(phase==="name"||phase==="result"||phase==="secret")return null;
 return <>
  {speech && <div className="mascot-bubble show">{speech}</div>}
  <div className="mascot-float" onClick={onCheat} title="Click me (5x for a surprise)"><img src="/assets/images/mascot.svg" alt="Boyfriend mascot"/></div>
 </>;
}
